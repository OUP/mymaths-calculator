import { checkIfFraction, convertFracToDecimal } from '../Utilities';
import construct from './Construct';

export default function inverseTrig(trigFunc, arg) {
  if (specialCaseArg(trigFunc, arg)) {
    return specialCaseInvTrig(trigFunc, arg);
  } else {
    return standardInvTrig(trigFunc, arg);
  }
}

function specialCaseArg(trigFunc, arg) {
  switch (arg.toString()) {
    case '-1':
    case '0':
    case '1':
    case '-0.5':
    case '0.5':
      return true;

    default:
      break;
  }

  switch (trigFunc) {
    case 'sin⁻¹':
    case 'cos⁻¹':
      return specialCaseArgAsinAcos(arg);

    case 'tan⁻¹':
      return specialCaseArgAtan(arg);

    default:
      return false;
  }
}

function specialCaseArgAsinAcos(arg) {
  switch (arg) {
    default:
      return false;
  }
}

function specialCaseArgAtan(arg) {
  switch (arg) {
    default:
      return false;
  }
}

function specialCaseInvTrig(trigFunc, arg) {
  switch (trigFunc) {
    case 'sin⁻¹':
      return specialCaseValAsin(arg);

    case 'cos⁻¹':
      return specialCaseValAcos(arg);
  }
}

function specialCaseValAsin(arg) {
  switch (arg.toString()) {
    case '-1':
      return construct('π')
        .times(-1)
        .div(2);

    case '0':
      return 0;

    case '1':
      return construct('π').div(2);

    case '-0.5':
      return construct('π')
        .times(-1)
        .div(6);

    case '0.5':
      return construct('π').div(6);

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

    default:
      return 0;
  }
}

function standardInvTrig(trigFunc, arg) {
  if (checkIfFraction(arg)) {
    arg = convertFracToDecimal(arg);
  }
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
