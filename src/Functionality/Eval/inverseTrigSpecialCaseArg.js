export default function specialCaseArg(trigFunc, arg) {
  if (arg.simplify) {
    arg = arg.simplify();
  }

  switch (arg.toString()) {
    case '-1':
    case '0':
    case '1':
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
  switch (arg.toString()) {
    case '-0.5':
    case '0.5':
    case '\\frac{\\sqrt {2}} {2}':
    case '\\frac{-\\sqrt {2}} {2}':
    case '\\frac{\\sqrt {3}} {2}':
    case '\\frac{-\\sqrt {3}} {2}':
      return true;

    default:
      return false;
  }
}

function specialCaseArgAtan(arg) {
  switch (arg.toString()) {
    case '\\sqrt {3}':
    case '-\\sqrt {3}':
    case '\\frac{\\sqrt {3}} {3}':
    case '\\frac{-\\sqrt {3}} {3}':
      return true;

    default:
      return false;
  }
}
