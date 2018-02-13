import React from 'react';
const Fraction = require('fraction.js');
//import Decimal from 'decimal.js/decimal';
import { buttonType } from './ButtonType';
import { assembleNumbers, assembleArguments } from './CalcEval';
import '../UI/Maths.css';

export function parseToRender(
  arr,
  cursorPosition = -1,
  displayMode = 'default'
) {
  return (
    <math className="Maths">
      {parseToMaths(arr, cursorPosition, displayMode)}
    </math>
  );
}

function parseToMaths(arr, cursorPosition, displayMode) {
  if (cursorPosition >= 0) {
    arr = addCursor(arr, cursorPosition);
  }
  arr = assembleNumbers(arr);
  arr = assembleArguments(arr);
  return arr.map(parseElToMaths);
}

function addCursor(arr, position) {
  arr = arr.filter(x => x !== '¦');
  arr.splice(position, 0, '¦');
  return arr;
}

/*eslint-disable */
//Note: cArg denotes a hidden character
function parseElToMaths(el) {
  const bType = buttonType(el);
  switch (bType) {
    case 'number':
      if (!el.includes('/')) {
        return <mn>{el}</mn>;
      } else {
        el = new Fraction(el);
        return (
          <mfrac className="Fraction">
            <mn>{el.n}</mn>
            <mn>{el.d}</mn>
          </mfrac>
        );
      }

    case 'operator':
      switch (el) {
        case 'x²':
          return (
            <msup>
              <mn>{}</mn>
              <mn>{2}</mn>
            </msup>
          );

        case 'x³':
          return (
            <msup>
              <mn>{}</mn>
              <mn>{3}</mn>
            </msup>
          );

        default:
          return <mo>{el}</mo>;
      }

    case 'function':
      let dispArg;
      switch (el.function) {
        case '√(x)':
          dispArg = el.argument.filter(x => x !== 'cArg');
          return (
            <msqrt className="Root">
              <mstyle className="InsideRoot">{parseToMaths(dispArg)}</mstyle>
            </msqrt>
          );

        case '(':
          if (safeArgClosed(el)) {
            dispArg = el.argument.filter(x => x !== ')');
            dispArg = dispArg.filter(x => buttonType(x) !== 'cArg');
            return <mfenced>{parseToMaths(dispArg)}</mfenced>;
          } else {
            return (
              <mtext>
                (
                {parseToMaths(el.argument)}
              </mtext>
            );
          }

        default:
          if (safeArgClosed(el) && el !== ')') {
            dispArg = el.argument.filter(x => x !== ')');
            dispArg = dispArg.filter(x => buttonType(x) !== 'cArg');
            return (
              <mtext>
                {funcToStringMap(el.function)}
                <mfenced>{parseToMaths(dispArg)}</mfenced>
              </mtext>
            );
          } else if (el !== ')' && el !== 'cArg') {
            return (
              <mtext>
                {funcToStringMap(el.function)}
                (
                {parseToMaths(el.argument)}
              </mtext>
            );
          } else {
            switch (el) {
              case ')':
                return <mtext>)</mtext>;
            }
          }
      }
      break;

    case 'cArg':
      break;

    default:
      return (
        <mtext>
          <mstyle className="Cursor">{el}</mstyle>
        </mtext>
      );
  }
}
/*eslint-enable */

function funcToStringMap(func) {
  switch (func) {
    case '|x|':
      return '|';

    case 'log(x)':
      return 'log';

    case 'ln(x)':
      return 'ln';

    case '√(x)':
      return '√';

    case 'sin(x)':
      return 'sin';

    case 'cos(x)':
      return 'cos';

    case 'tan(x)':
      return 'tan';

    case 'sin⁻¹':
      return 'sin⁻¹';

    case 'cos⁻¹':
      return 'cos⁻¹';

    case 'tan⁻¹':
      return 'tan⁻¹';

    case '(':
      return '';

    case ')':
      return ')';

    default:
      return func;
  }
}

function safeArgClosed(el) {
  if (el) {
    if (el.argument) {
      if (el.argument.includes(')')) {
        return true;
      }
    }
  }
  return false;
}

/*
//This will become more complicated to deal with fractions etc.
export function parseToRender(
  arr,
  cursorPosition = -1,
  displayMode = 'default'
) {
  if (cursorPosition >= 0) {
    arr = addCursor(arr, cursorPosition);
  }

  let i,
    str = '';
  for (i = 0; i < arr.length; i++) {
    str += parseElement(arr[i], displayMode);
  }

  return str;
}

function addCursor(arr, position) {
  arr = arr.filter(x => x !== '¦');
  arr.splice(position, 0, '¦');
  return arr;
}

function parseElement(el, displayMode = 'default') {
  const type = buttonType(el);
  switch (type) {
    case 'number':
      return parseNumber(el, displayMode);

    case 'operator':
      return opToStringMap(el);

    case 'function':
      if (el.function) {
        const func = funcToStringMap(el.function);
        if (el.argument) {
          return func + parseToRender(el.argument);
        } else {
          return func;
        }
      } else {
        return el;
      }

    default:
      return el;
  }
}

function parseNumber(el, displayMode = 'default') {
  if (el === '(-)') {
    el = '-';
  }

  switch (displayMode) {
    case 'fraction':
      if (!checkNumComplexity(el)) {
        el = new Fraction(el);
        return el.toFraction();
      } else {
        return el;
      }

    case 'decimal':
      if (el.includes('/')) {
        el = new Fraction(el);
        return el.toString();
      } else {
        return el;
      }

    default:
      return el;
  }
}

function checkNumComplexity(el) {
  //Check whether el is too complicated to represent as a fraction
  if (!el.includes('/')) {
    el = new Decimal(el);
    if (
      el < 100000 &&
      el.toFraction(10000).toString() === el.toFraction(100000).toString()
    ) {
      return false;
    } else {
      return true;
    }
  } else {
    //el is already a fraction
    return false;
  }
}

function opToStringMap(op) {
  switch (op) {
    case 'x²':
      return '²';

    case 'x³':
      return '³';

    case 'x⁻¹':
      return '⁻¹';

    case 'x!':
      return '!';

    default:
      return op;
  }
}

function funcToStringMap(func) {
  switch (func) {
    case '|x|':
      return '|';

    case 'log(x)':
      return 'log(';

    case 'ln(x)':
      return 'ln(';

    case '√(x)':
      return '√(';

    case 'sin(x)':
      return 'sin(';

    case 'cos(x)':
      return 'cos(';

    case 'tan(x)':
      return 'tan(';

    case 'sin⁻¹':
      return 'sin⁻¹(';

    case 'cos⁻¹':
      return 'cos⁻¹(';

    case 'tan⁻¹':
      return 'tan⁻¹(';

    case '(':
      return '(';

    case ')':
      return ')';

    default:
      return func;
  }
}

*/
