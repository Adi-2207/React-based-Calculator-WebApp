import { useState } from 'react';
import './App.css';

const buttons = [
  ['AC', '+/-', '%', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '-'],
  ['1', '2', '3', '+'],
  ['0', '.', '='],
];

function App() {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDot = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clearAll = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const toggleSign = () => {
    setDisplay((prev) => (prev.charAt(0) === '-' ? prev.slice(1) : '-' + prev));
  };

  const inputPercent = () => {
    setDisplay((parseFloat(display) / 100).toString());
  };

  const performOperation = (nextOperator) => {
    const inputValue = parseFloat(display);
    if (operator && waitingForOperand) {
      setOperator(nextOperator);
      return;
    }
    if (firstOperand == null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = calculate(firstOperand, inputValue, operator);
      setDisplay(String(result));
      setFirstOperand(result);
    }
    setOperator(nextOperator);
    setWaitingForOperand(true);
  };

  const calculate = (first, second, operator) => {
    switch (operator) {
      case '+':
        return first + second;
      case '-':
        return first - second;
      case '×':
        return first * second;
      case '÷':
        return second === 0 ? 'Error' : first / second;
      default:
        return second;
    }
  };

  const handleButtonClick = (value) => {
    if (!isNaN(value)) {
      inputDigit(value);
    } else if (value === '.') {
      inputDot();
    } else if (value === 'AC') {
      clearAll();
    } else if (value === '+/-') {
      toggleSign();
    } else if (value === '%') {
      inputPercent();
    } else if (['+', '-', '×', '÷'].includes(value)) {
      performOperation(value);
    } else if (value === '=') {
      if (operator && firstOperand != null && !waitingForOperand) {
        const result = calculate(firstOperand, parseFloat(display), operator);
        setDisplay(String(result));
        setFirstOperand(null);
        setOperator(null);
        setWaitingForOperand(true);
      }
    }
  };

  return (
    <div className="calculator-container">
      <div className="calculator">
        <div className="calculator-display">{display}</div>
        <div className="calculator-buttons">
          {buttons.flat().map((btn, idx) => {
            let specialClass = '';
            if (btn === 'AC') specialClass = 'calc-btn-AC';
            else if (btn === '+/-') specialClass = 'calc-btn-plusminus';
            else if (btn === '%') specialClass = 'calc-btn-percent';
            else if (btn === '÷') specialClass = 'calc-btn-divide';
            else if (btn === '×') specialClass = 'calc-btn-multiply';
            else if (btn === '-') specialClass = 'calc-btn-minus';
            else if (btn === '+') specialClass = 'calc-btn-plus';
            else if (btn === '=') specialClass = 'calc-btn-equals';
            else if (btn === '0') specialClass = 'calc-btn-0';
            return (
              <button
                key={idx}
                className={`calc-btn ${specialClass}`}
                onClick={() => handleButtonClick(btn)}
              >
                {btn}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
