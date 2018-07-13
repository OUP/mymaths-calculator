import { generateDecimal } from './SymbolicTrig';
import Decimal from 'decimal.js/decimal';

export default function inverseTrig(trigFunc, arg) {
  return specialCaseValue(trigFunc, arg)
    ? specialCaseInvTrig(trigFunc, arg)
    : standardInvTrig(trigFunc, arg);
}

function specialCaseValue(trigFunc, arg) {
  switch (trigFunc) {
    case 'sin⁻¹':
      return sinSpecialCaseValue(arg);

    case 'cos⁻¹':
      return cosSpecialCaseValue(arg);

    case 'tan⁻¹':
      return tanSpecialCaseValue(arg);

    default:
      return 0;
  }
}

function standardInvTrig(trigFunc, arg) {
  if (arg.constructor !== Decimal) {
    arg = generateDecimal(arg);
  }

  switch (trigFunc) {
    case 'sin⁻¹':
      return arg.asin();

    case 'cos⁻¹':
      return arg.acos();

    case 'tan⁻¹':
      return arg.atan();

    default:
      console.warn('invalid trigFunc');
      return '0';
  }
}

function specialCaseInvTrig(trigFunc, arg) {
  switch (trigFunc) {
    case 'sin⁻¹':
      return asinSpecialCase(arg);

    case 'cos⁻¹':
      return acosSpecialCase(arg);

    case 'tan⁻¹':
      return atanSpecialCase(arg);

    default:
      return 0;
  }
}

function sinSpecialCaseValue(arg) {
  switch (arg) {
    case '0':
      return true;

    default:
      return false;
  }
}

function cosSpecialCaseValue(arg) {
  switch (arg) {
    case '0':
      return true;

    default:
      return false;
  }
}

function tanSpecialCaseValue(arg) {
  switch (arg) {
    case '0':
      return true;

    default:
      return false;
  }
}

function asinSpecialCase(arg) {
  switch (arg) {
    case '0':
      return true;

    default:
      return false;
  }
}

function acosSpecialCase(arg) {
  switch (arg) {
    case '0':
      return true;

    default:
      return false;
  }
}

function atanSpecialCase(arg) {
  switch (arg) {
    case '0':
      return true;

    default:
      return false;
  }
}
