import { FractionExpression, Term, Expression } from './Symbol';

export function symbolicOp(v1, operation, v2 = 0) {
  v1 = construct(v1);
  v2 = construct(v2);
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
      return v1.plus(v2);

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
      if (x === 'π') {
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
