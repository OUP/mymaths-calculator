import { checkIfFraction, convertFracToDecimal } from '../Utilities';

export default function inverseTrig(trigFunc, arg) {
  if (specialCaseValue(trigFunc, arg)) {
    return specialCaseInvTrig(trigFunc, arg);
  } else {
    return standardInvTrig(trigFunc, arg);
  }
}

function specialCaseValue(trigFunc, arg) {
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
      return specialCaseAsinAcos(arg);

    case 'tan⁻¹':
      return specialCaseATan(arg);

    default:
      return false;
  }
}

function specialCaseAsinAcos(arg) {
  switch (arg) {
    default:
      return false;
  }
}

function specialCaseATan(arg) {
  switch (arg) {
    default:
      return false;
  }
}

function specialCaseInvTrig(trigFunc, arg) {}

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
