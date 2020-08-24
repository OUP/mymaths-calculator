import Decimal from 'decimal.js/decimal';
import { checkIfFraction } from '../Utilities';
import { FractionExpression, Term, Expression } from '../Classes/Symbol';
import {
  SquareRoot,
  SqrtExpression,
  SqrtFractionExpression
} from '../Classes/Surd';

export default function construct(x) {
  let term, exp;
  const defaultDenom = new Expression(new Term(1));
  switch (true) {
    case x.constructor === String:
      if (x.includes('π')) {
        term = new Term(1, ['π'], [1]);
        exp = new Expression([term]);
        return new FractionExpression(exp, defaultDenom);
      } else if (parseFloat(x).toString() === x) {
        term = new Term(parseFloat(x));
        exp = new Expression([term]);
        return new FractionExpression(exp, defaultDenom);
      } else if (x.includes('√')) {
        term = new SquareRoot(x);
        exp = new SqrtExpression([term]);
        return new SqrtFractionExpression(exp, defaultDenom);
      } else if (x.includes('/')) {
        term = new Term(x);
        exp = new Expression([term]);
        return new FractionExpression(exp, defaultDenom).simplify();
      }
      break;

    case checkIfFraction(x):
    case x.constructor === Decimal:
      term = new Term(x);
      exp = new Expression([term]);
      return new FractionExpression(exp, defaultDenom);

    default:
      return x;
  }
}
