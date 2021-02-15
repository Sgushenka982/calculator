class Calculator {
    constructor(input, output) {
        this.inputDisplay = input
        this.outputDisplay = output
        this.inputHistory = []
        this.outputHistory = []
    }

    clearAllHistory() {
        this.outputHistory = []
        this.inputHistory = []
        this.updateInputDisplay()
        this.updateOutputDisplay('0')
    }

    backspace() {
        if (this.getLastInputType() === 'equals') {
            this.clearInputHistory()
        } else {
            if (this.getLastOutputType() !== null) {
                if (this.getLastOutputValue() === 'Infinity' || this.getLastOutputValue() === '-Infinity' || this.getLastOutputValue() === 'NaN') {
                    this.clearAllHistory()
                } else if (this.getLastOutputValue().length > 1) {
                    this.editLastOutput(this.getLastOutputValue().slice(0, -1), 'number')
                } else {
                    this.deleteLastoutput()
                }
            }
        }
    }

    changePercentToDecimal() {
        if (this.getLastOutputType() === 'number') {
            this.editLastOutput(this.getLastOutputValue() / 100, 'number')
        }
    }

    insertNumber(value) {
        if (this.getLastOutputType() === null) {
            this.addNewOutput(value, 'number')
        } else if (this.getLastOutputType() === 'number' && this.getLastInputType() !== 'equals') {
            if (this.getLastOutputValue().length>=14) {return}
            this.appendToLastOutput(value)
        } else if (this.getLastInputType() === 'equals') {
            this.clearAllHistory()
            this.addNewOutput(value, 'number')
        }
    }

    insertOperation(value) {
        if (this.getLastInputType() === 'operator' && this.getLastOutputType() !== 'number') {
            this.editLastInput(value, 'operator')
        } else if (this.getLastInputType() === 'equals') {
            let output = this.getOutputValue()
            this.clearAllHistory()
            this.addNewInput(output, 'number')
            this.addNewInput(value, 'operator')
        } else {
            this.transitionNumberFromOutputToInput(value)
            this.addNewInput(value, 'operator')
        }
    }

    nagationNumber() {
        if (this.getLastOutputType() === 'number') {
            this.editLastOutput(parseFloat(this.getLastOutputValue()) * -1, 'number')
        }
    }

    insertDecimalPoint() {
        if (this.getLastOutputType() === 'number' && !this.getLastOutputValue().toString().includes('.')) {
            this.appendToLastOutput('.')
        } else if (this.getLastOutputType() === 'operator' || this.getLastOutputType() === null) {
            this.addNewOutput('0.', 'number')
        }
    }

    generateResult() {
        if (this.getLastOutputType() === 'number') {
            this.transitionNumberFromOutputToInput()
            const self = this
            const simplifyExpression = function (currentExpression, operator) {
                if (currentExpression.indexOf(operator) === -1) {
                    return currentExpression
                } else {
                    let operatorIdx = currentExpression.indexOf(operator)
                    let leftOperandIdx = operatorIdx - 1
                    let rightOperatorIdx = operatorIdx + 1

                    let partialSolution = self.performOperation(...currentExpression.slice(leftOperandIdx, rightOperatorIdx + 1))

                    currentExpression.splice(leftOperandIdx, 3, partialSolution.toString())

                    return simplifyExpression(currentExpression, operator)
                }
            }

            let result = ['×', '÷', '-', '+'].reduce(simplifyExpression, this.getAllInputValues())

            

            this.addNewInput('=', 'equals')
            this.addNewOutput(result.toString(), 'number')

            if(outputDisplay.offsetWidth>310){
                outputDisplay.style.cssText = 'font-size:1.25rem;'
            }else{
                outputDisplay.style['font-size'] = ''
            }
        }
    }

    /*HELPER FUNCTIONS */
    getLastInputType() {
        return (this.inputHistory.length === 0) ? null : this.inputHistory[this.inputHistory.length - 1].type
    }

    getLastInputValue() {
        return (this.inputHistory.length === 0) ? null : this.inputHistory[this.inputHistory.length - 1].value
    }

    getLastOutputType() {
        return (this.outputHistory.length === 0) ? null : this.outputHistory[this.outputHistory.length - 1].type
    }

    getLastOutputValue() {
        return (this.outputHistory.length === 0) ? null : this.outputHistory[this.outputHistory.length - 1].value
    }

    getAllInputValues() {
        return this.inputHistory.map(entry => entry.value)
    }

    getOutputValue() {
        return this.outputDisplay.value.replace(/,/g, '')
    }

    addNewOutput(value, type) {
        this.outputHistory.push({ 'type': type, 'value': value })
        this.updateOutputDisplay(this.outputHistory[this.outputHistory.length - 1]['value'])
    }

    addNewInput(value, type) {
        this.inputHistory.push({ 'type': type, 'value': value.toString() })
        this.updateInputDisplay()
    }

    appendToLastInput(value) {
        this.inputHistory[this.inputHistory.length - 1].value += value.toString()
        this.updateInputDisplay()
    }

    appendToLastOutput(value) {
        this.outputHistory[this.outputHistory.length - 1].value += value.toString()
        this.updateOutputDisplay(this.outputHistory[this.outputHistory.length - 1]['value'])
    }

    clearOutputHistory() {
        this.outputHistory = []
        this.updateOutputDisplay('0')
    }

    clearInputHistory() {
        this.inputHistory = []
        this.updateInputDisplay()
    }

    checkLengthOfDecimalPart(value){
        if(this.howManySignsInFloat(value)<=13){
            return value
        }else{
            return value.toFixed(13)
        }
    }

    editLastInput(value, type) {
        this.inputHistory.pop()
        this.addNewInput(value, type)
    }

    editLastOutput(value, type) {
        this.outputHistory.pop()
        this.addNewOutput(value, type)
    }

    deleteLastInput() {
        this.inputHistory.pop()
        this.updateInputDisplay()
    }

    deleteLastoutput() {
        this.outputHistory.pop()
        this.updateOutputDisplay('0')
    }

    howManySignsInFloat(value) {
        return (value.toString().includes('.')) ? (value.toString().split('.').pop().length) : (0)
    }

    longestDecimalPart(number1, number2) {
        if (this.howManySignsInFloat(number1) < this.howManySignsInFloat(number2)) {
            return this.howManySignsInFloat(number2)
        } else {
            return this.howManySignsInFloat(number1)
        }

    }

    transitionNumberFromOutputToInput() {
        let output = this.getLastOutputValue()
        this.clearOutputHistory()
        this.addNewInput(output, 'number')
    }

    updateInputDisplay() {
        this.inputDisplay.value = this.getAllInputValues().join(' ')
    }

    updateOutputDisplay(value) {
        this.outputDisplay.value = value.toLocaleString('ru-RU')
    }

    performOperation(leftOperand, operation, rightOperand) {
        leftOperand = parseFloat(leftOperand)
        rightOperand = parseFloat(rightOperand)

        let result = null

        let howLongToFix = this.longestDecimalPart(leftOperand, rightOperand)

        if (Number.isNaN(leftOperand) || Number.isNaN(rightOperand)) {
            return
        }


        if (howLongToFix == 0) {
            switch (operation) {
                case '×':
                    result=leftOperand * rightOperand
                    return this.checkLengthOfDecimalPart(result)               
                case '÷':
                    result=leftOperand /rightOperand
                    return this.checkLengthOfDecimalPart(result)
                case '-':
                    result=leftOperand - rightOperand
                    return this.checkLengthOfDecimalPart(result)
                case '+':
                    result=leftOperand + rightOperand
                    return this.checkLengthOfDecimalPart(result)
                default:
                    return
            }
        } else {
            switch (operation) {
                case '×':
                    return (leftOperand * rightOperand).toFixed(howLongToFix)
                case '÷':
                    return (leftOperand / rightOperand).toFixed(howLongToFix)
                case '-':
                    return (leftOperand - rightOperand).toFixed(howLongToFix)
                case '+':
                    return (leftOperand + rightOperand).toFixed(howLongToFix)
                default:
                    return
            }
        }
    }
}// End Calculator Class Defenition

//Create binding to accets DOM elements
const inputDisplay = document.querySelector('#history')
const outputDisplay = document.querySelector('#result')

const allClearButton = document.querySelector('[data-all-clear]')
const backspaceButton = document.querySelector('[data-backspace]')
const percentButton = document.querySelector('[data-percent]')
const operationButtons = document.querySelectorAll('[data-operator]')
const numberButtons = document.querySelectorAll('[data-number]')
const negationButton = document.querySelector('[data-negation]')
const decimalButton = document.querySelector('[data-decimal]')
const equalsButton = document.querySelector('[data-equals]')

//Create a new Calculator
const calculator = new Calculator(inputDisplay, outputDisplay)

//Add event handlers to the calculator buttons
allClearButton.addEventListener('click', () => {
    calculator.clearAllHistory()
})

backspaceButton.addEventListener('click', () => {
    calculator.backspace()
})

percentButton.addEventListener('click', () => {
    calculator.changePercentToDecimal()
})

operationButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        let { target } = event
        calculator.insertOperation(target.dataset.operator)
    })
})

numberButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        let { target } = event
        calculator.insertNumber(target.dataset.number)
    })
})

negationButton.addEventListener('click', () => {
    calculator.nagationNumber()
})

decimalButton.addEventListener('click', () => {
    calculator.insertDecimalPoint()
})

equalsButton.addEventListener('click', () => {
    calculator.generateResult()
})