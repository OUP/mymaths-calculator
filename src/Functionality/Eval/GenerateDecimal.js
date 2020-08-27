import Decimal from 'decimal.js/decimal';
const Fraction = require('fraction.js');
import { checkIfFraction } from '../Utilities';

export function generateDecimal(value) {
  switch (value.constructor) {
    case String:
      return convertFracStringToDecimal(value);

    case Fraction:
    default:
      return convertFracStringToDecimal(value.toString());

    case Decimal:
      return value;

    case Number:
      return new Decimal(value);
  }
}

export function convertFracStringToDecimal(fracString) {
  if (checkIfFraction(fracString)) {
    const fraction = new Fraction(fracString);
    return new Decimal(fraction.n).div(fraction.d).times(fraction.s);
  } else {
    return new Decimal(fracString);
  }
}
