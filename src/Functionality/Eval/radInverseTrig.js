import construct from './Construct';
import { generateDecimal } from './GenerateDecimal';
import specialCaseArg from './inverseTrigSpecialCaseArg';

export default function radInverseTrig(trigFunc, arg) {
  if (specialCaseArg(trigFunc, arg)) {
    return specialCaseInvTrig(trigFunc, arg);
  } else {
    const newArg = generateDecimal(arg);
    return standardInvTrig(trigFunc, newArg);
  }
}

function specialCaseInvTrig(trigFunc, arg) {
  switch (trigFunc) {
    case 'sin⁻¹':
      return specialCaseValAsin(arg);

    case 'cos⁻¹':
      return specialCaseValAcos(arg);

    case 'tan⁻¹':
      return specialCaseValAtan(arg);
  }
}

function specialCaseValAsin(arg) {
  switch (arg.toString()) {
    case '-1':
      return construct('π').div(-2);

    case '0':
      return 0;

    case '1':
      return construct('π').div(2);

    case '-0.5':
      return construct('π').div(-6);

    case '0.5':
      return construct('π').div(6);

    case '\\frac{\\sqrt {2}} {2}':
      return construct('π').div(4);

    case '\\frac{-\\sqrt {2}} {2}':
      return construct('π').div(-4);

    case '\\frac{\\sqrt {3}} {2}':
      return construct('π').div(3);

    case '\\frac{-\\sqrt {3}} {2}':
      return construct('π').div(-3);

    default:
      return 0;
  }
}

function specialCaseValAcos(arg) {
  switch (arg.toString()) {
    case '-1':
      return construct('π');

    case '0':
      return construct('π').div(2);

    case '1':
      return 0;

    case '-0.5':
      return construct('π')
        .times(2)
        .div(3);

    case '0.5':
      return construct('π').div(3);

    case '\\frac{\\sqrt {2}} {2}':
      return construct('π').div(4);

    case '\\frac{-\\sqrt {2}} {2}':
      return construct('π')
        .times(3)
        .div(4);

    case '\\frac{\\sqrt {3}} {2}':
      return construct('π').div(6);

    case '\\frac{-\\sqrt {3}} {2}':
      return construct('π')
        .times(5)
        .div(6);

    default:
      return 0;
  }
}

function specialCaseValAtan(arg) {
  switch (arg.toString()) {
    case '-1':
      return construct('π').div(-4);

    case '0':
      return 0;

    case '1':
      return construct('π').div(4);

    case '\\sqrt {3}':
      return construct('π').div(3);

    case '-\\sqrt {3}':
      return construct('π').div(-3);

    case '\\frac{\\sqrt {3}} {3}':
      return construct('π').div(6);

    case '\\frac{-\\sqrt {3}} {3}':
      return construct('π').div(-6);

    default:
      return 0;
  }
}

function standardInvTrig(trigFunc, arg) {
  switch (trigFunc) {
    case 'sin⁻¹':
      return arg.asin();

    case 'cos⁻¹':
      return arg.acos();

    case 'tan⁻¹':
      return arg.atan();

    default:
      return 0;
  }
}
