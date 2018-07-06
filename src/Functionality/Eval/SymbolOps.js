import Decimal from 'decimal.js/decimal';
import { FractionExpression, Term, Expression } from '../Classes/Symbol';
import { numericOp } from './NumericOp';
import { checkIfFraction, convertFracToDecimal } from '../Utilities';
import {
  SquareRoot,
  SqrtExpression,
  SqrtFractionExpression
} from '../Classes/Surd';
import processValue from './ProcessValue';
import symbolicTrig from './SymbolicTrig';

export function symbolicOp(v1, operation, v2 = 0) {
  if (needToReverseOrder(v1, operation, v2)) {
    /**
     * This is necessary because the methods from fraction.js
     * and decimal.js can't take the calculator's symbolic and
     * square root classes as parameters
     */
    return reversedOrderOp(v1, operation, v2);
  }
  v1 = construct(v1);
  if (typeof v2 !== 'undefined') {
    v2 = construct(v2);
  }

  let result;

  switch (operation) {
    case 'xⁿ':
      const v2Val = v2.evaluate();
      const v2ValStr = v2Val.toString();
      if (!checkIfFraction(v2ValStr) && !v2ValStr.includes('.')) {
        result = symbolPow(v1, v2Val);
      } else {
        result = numericOp(v1.evaluate(), 'xⁿ', v2Val);
      }
      break;

    case 'x!':
      break; //WiP

    case '%':
      result = v1.div(100);
      break;

    case '÷':
      result = v1.div(v2);
      break;

    case '×':
      result = v1.times(v2);
      break;

    case '–':
      result = v1.minus(v2);
      break;

    case '+':
      result = v1.plus(v2);
      break;

    default:
      console.error("Don't know how to do the operation " + operation);
      result = ['error'];
      break;
  }

  return processValue(safeSimplify(result));
}

function construct(x) {
  let term, exp;
  const defaultDenom = new Expression(new Term(1));
  switch (true) {
    case x.constructor === String:
      if (x.includes('π')) {
        term = new Term(1, ['π'], [1]);
        exp = new Expression([term]);
        return new FractionExpression(exp, defaultDenom);
      } else if (parseFloat(x).toString() === x) {
        term = new Term(parseFloat(x));
        exp = new Expression([term]);
        return new FractionExpression(exp, defaultDenom);
      } else if (x.includes('√')) {
        term = new SquareRoot(x);
        exp = new SqrtExpression([term]);
        return new SqrtFractionExpression(exp, defaultDenom);
      } else if (x.includes('/')) {
        term = new Term(x);
        exp = new Expression([term]);
        return new FractionExpression(exp, defaultDenom).simplify();
      }
      break;

    case checkIfFraction(x):
    case x.constructor === Decimal:
      term = new Term(x);
      exp = new Expression([term]);
      return new FractionExpression(exp, defaultDenom);

    default:
      return x;
  }
}

export function funcOnSymbol(func, arg, arg2) {
  arg = construct(arg);
  if (typeof arg2 !== 'undefined') {
    arg2 = construct(arg2);
  }

  let result;

  if (checkForSubstitution(func, arg)) {
    arg = convertFracToDecimal(arg.evaluate());
  }

  switch (func) {
    case 'numerator':
      result = symbolicOp(arg, '÷', arg2);
      break;

    case '|x|':
      result = arg.abs();
      break;

    case 'log(x)':
      result = arg.log(10);
      break;

    case 'ln(x)':
      result = arg.ln();
      break;

    case '√(x)':
      result = arg.sqrt();
      break;

    case 'sin(x)':
      result = symbolicTrig('sin', arg);
      break;

    case 'cos(x)':
      result = symbolicTrig('cos', arg);
      break;

    case 'tan(x)':
      result = symbolicTrig('tan', arg);
      break;

    case 'sin⁻¹':
      result = arg.asin();
      break;

    case 'cos⁻¹':
      result = arg.acos();
      break;

    case 'tan⁻¹':
      result = arg.atan();
      break;

    case '(':
      result = arg;
      break;
  }
  return processValue(safeSimplify(result));
}

function symbolPow(base, exponent) {
  exponent = parseInt(exponent.toString(), 10);
  switch (true) {
    case exponent > 0:
      let result = 1;
      for (let i = 1; i <= exponent; i++) {
        result = base.times(result);
      }
      return result;

    case exponent === 0:
      return '1';

    case exponent < 0:
      return symbolPow(base, -exponent).reciprocal();
  }
}

function safeSimplify(value) {
  return typeof value.simplify === 'function' ? value.simplify() : value;
}

function needToReverseOrder(v1, operation, v2) {
  switch (operation) {
    case '+':
    case '–':
    case '×':
    case '÷':
      return (
        typeof v1.conString === 'undefined' &&
        typeof v2.conString === 'function'
      );
    /**
     * conString is a method which exists on symbols and
     * square roots but not on fractions and decimals
     */

    default:
      return false;
  }
}

function reversedOrderOp(v1, operation, v2) {
  //v1 and v2 are still in the original order in params
  switch (operation) {
    case '+':
      return symbolicOp(v2, '+', v1);

    case '–':
      return symbolicOp(v2.timesMinusOne(), '+', v1);

    case '×':
      return symbolicOp(v2, '×', v1);

    case '÷':
      return symbolicOp(v2.reciprocal(), '×', v1);
  }
}

function checkForSubstitution(func, arg) {
  const specialCaseFunc =
    isTrigFunc(func) || isFraction(func) || isIdentity(func);
  const canSubstituteArg = typeof arg.conString === 'function';
  return !specialCaseFunc && canSubstituteArg;
}

function isTrigFunc(func) {
  return (
    func === 'sin(x)' ||
    func === 'cos(x)' ||
    func === 'tan(x)' ||
    func === 'sin⁻¹' ||
    func === 'cos⁻¹' ||
    func === 'tan⁻¹'
  );
}

function isFraction(func) {
  return func === 'numerator';
}

function isIdentity(func) {
  return func === '(' || func === '|x|';
}
