import Decimal from 'decimal.js/decimal';
const Fraction = require('fraction.js');
import buttonType, { makeString } from '../ButtonType';
import { checkForSymbols } from '../Utilities';
import { opPriority } from './OrganiseOps';
import { symbolicOp } from './SymbolOps';
import { numericOp } from './NumericOp';

export function doArithmeticOp(inputArray, position) {
  const operation = inputArray[position].value;
  const value = evalArithmeticOp(inputArray, position, operation);
  updateArrayFromOp(inputArray, position, operation, outputFactory(value));
  return;
}

function evalArithmeticOp(inputArray, position, operation) {
  const valBefore = inputArray[position - 1].value;
  const valAfter = replaceUndefinedWithZero(inputArray[position + 1]);
  return opValue(valBefore, operation, valAfter);
}

function opValue(valBefore, operation, valAfter) {
  return isSymbolOp(valBefore, valAfter)
    ? symbolicOp(valBefore, operation, valAfter)
    : numericOp(valBefore, operation, valAfter);
}

function updateArrayFromOp(inputArray, position, operation, output) {
  const numOfCharsInOp = isInfixOp(operation) ? 3 : 2;
  inputArray.splice(position - 1, numOfCharsInOp, output);
}

function outputFactory(value) {
  const outputValue = isDecimalOrFraction(value) ? makeString(value) : value;
  const output = { value: outputValue, type: buttonType(value) };
  return Object.assign(output, { priority: opPriority(output) });
}

const isSymbolOp = (valBefore, valAfter) =>
  checkForSymbols(valBefore) || checkForSymbols(valAfter);

const isInfixOp = operation => operation !== 'x!' && operation !== '%';

const replaceUndefinedWithZero = val =>
  typeof val !== 'undefined' ? val.value : '0';

const isDecimalOrFraction = ({ constructor }) =>
  constructor === Decimal || constructor === Fraction;
