import { FractionExpression, Term, Expression } from './Symbol';

export function symbolicOp(v1, operation, v2 = 0) {
  v1 = construct(v1);
  if (v2 !== 'undefined') {
    v2 = construct(v2);
  }
  switch (operation) {
    case 'xⁿ':
      break; //WiP

    case 'x²':
      return v1.times(v1);

    case 'x³':
      return v1.times(v1).times(v1);

    case 'x⁻¹':
      return v1.reciprocal();

    case 'x!':
      break; //WiP

    case '%':
      return v1.divBy(100);

    case '÷':
      return v1.divBy(v2);

    case '×':
      return v1.times(v2);

    case '×10ⁿ':
      break; //WiP

    case '–':
      return v1.minus(v2);

    case '+':
      return v1.plus(v2).simplify();

    default:
      console.error("Don't know how to do the operation " + operation);
      return ['error'];
  }
}

function construct(x) {
  let term, exp;
  const defaultDenom = new Expression(new Term(1));
  switch (x.constructor) {
    case String:
      if (x.includes('π')) {
        term = new Term(1, ['π'], [1]);
        exp = new Expression([term]);
        return new FractionExpression(exp, defaultDenom);
      } else if (parseFloat(x).toString() === x) {
        term = new Term(parseFloat(x));
        exp = new Expression([term]);
        return new FractionExpression(exp, defaultDenom);
      }
      break;

    default:
      return x;
  }
}

export function funcOnSymbol(func, arg, arg2) {
  arg = construct(arg);
  if (arg2 !== 'undefined') {
    arg2 = construct(arg2);
  }
  switch (func) {
    case 'numerator':
      if (arg.constructor === FractionExpression) {
        return arg.divBy(arg2).simplify();
      } else if (arg2.constructor === FractionExpression) {
        return arg2
          .reciprocal()
          .times(arg)
          .simplify();
      } else {
        break;
      }

    case '|x|':
      return arg.abs();

    case 'base':
      return arg.toPower(arg2);

    case 'log(x)':
      return arg.log(10);

    case 'ln(x)':
      return arg.ln();

    case '√(x)':
      return arg.sqrt();

    case 'sin(x)':
      return arg.sin();

    case 'cos(x)':
      return arg.cos();

    case 'tan(x)':
      return arg.tan();

    case 'sin⁻¹':
      return arg.asin();

    case 'cos⁻¹':
      return arg.acos();

    case 'tan⁻¹':
      return arg.atan();

    case '(':
      return arg;
  }
}
