import { generateDecimal } from './GenerateDecimal';
import specialCaseArg from './inverseTrigSpecialCaseArg';
import radInverseTrig from './radInverseTrig';

export default function degInverseTrig(trigFunc, arg) {
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
      return -90;

    case '0':
      return 0;

    case '1':
      return 90;

    case '-0.5':
      return -30;

    case '0.5':
      return 30;

    case '\\frac{\\sqrt {2}} {2}':
      return 45;

    case '\\frac{-\\sqrt {2}} {2}':
      return -45;

    case '\\frac{\\sqrt {3}} {2}':
      return 60;

    case '\\frac{-\\sqrt {3}} {2}':
      return -60;

    default:
      return 0;
  }
}

function specialCaseValAcos(arg) {
  switch (arg.toString()) {
    case '-1':
      return 180;

    case '0':
      return 90;

    case '1':
      return 0;

    case '-0.5':
      return 120;

    case '0.5':
      return 60;

    case '\\frac{\\sqrt {2}} {2}':
      return 45;

    case '\\frac{-\\sqrt {2}} {2}':
      return 135;

    case '\\frac{\\sqrt {3}} {2}':
      return 30;

    case '\\frac{-\\sqrt {3}} {2}':
      return 150;

    default:
      return 0;
  }
}

function specialCaseValAtan(arg) {
  switch (arg.toString()) {
    case '-1':
      return -45;

    case '0':
      return 0;

    case '1':
      return 45;

    case '\\sqrt {3}':
      return 60;

    case '-\\sqrt {3}':
      return -60;

    case '\\frac{\\sqrt {3}} {3}':
      return 30;

    case '\\frac{-\\sqrt {3}} {3}':
      return -30;

    default:
      return 0;
  }
}

function standardInvTrig(trigFunc, arg) {
  const radValue = radInverseTrig(trigFunc, arg);
  return radToDegrees(radValue);
}

function radToDegrees(radValue) {
  return radValue.times(180).div(Math.PI);
}
