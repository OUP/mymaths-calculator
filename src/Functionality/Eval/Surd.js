import Decimal from 'decimal.js/decimal';
const Fraction = require('fraction.js');
import { Term, Expression, FractionExpression } from './Symbol';
import { opValue } from './DoArithmeticOp';
import { cloneState, convertFracToDecimal, removeElement } from '../Utilities';

export class SquareRoot extends Term {
  constructor(constructionParameter) {
    switch (constructionParameter.constructor) {
      case String:
        const sqrtString = constructionParameter;
        const sqrtPos = sqrtString.indexOf('√');
        let coefficient;
        if (sqrtPos >= 0) {
          if (sqrtPos > 0) {
            coefficient = sqrtString.slice(0, sqrtPos);
          } else {
            coefficient = 1;
          }
        }
        const root = sqrtString.slice(sqrtPos);
        super(coefficient, root, 1);
        break;

      case Term:
        const term = constructionParameter;
        super(term.coefficient, term.symbols, term.powers);
        break;
    }
  }

  toTerm() {
    return new Term(this.coefficient, this.symbols, this.powers);
  }

  toString() {
    if (this.symbols.length) {
      return `${this.coefficient} \\sqrt ${this.symbols[0].slice(1)}`;
    } else {
      return this.coefficient.toString();
    }
  }

  clone() {
    return new SquareRoot(super.clone());
  }

  evaluate() {
    const simplified = this.simplify();
    return simplified.toTerm().evaluate();
  }

  simplify() {
    let currentSqrt = this.clone();
    for (let i = 0; i < this.symbols.length; i++) {
      if (currentSqrt.symbols[i].includes('√')) {
        currentSqrt = reduceSqrt(currentSqrt, i);
      }
    }
    return currentSqrt;
  }

  plus(x) {
    return construct(super.plus(deconstruct(x)));
  }

  minus(x) {
    return construct(super.minus(deconstruct(x)));
  }

  times(x) {
    return construct(super.times(deconstruct(x))).simplify();
  }

  divBy(x) {
    return construct(super.divBy(deconstruct(x))).simplify();
  }

  reciprocal() {
    return new SquareRoot(super.reciprocal());
  }

  timesMinusOne() {
    return new SquareRoot(super.timesMinusOne());
  }
}

export class SqrtExpression extends Expression {
  constructor(constructionParameter) {
    let terms;
    switch (constructionParameter.constructor) {
      case Array:
        terms = constructionParameter;
        break;

      case Expression:
        terms = constructionParameter.terms;
        break;

      default:
        terms = [];
        break;
    }
    super(terms);
  }

  toExpression() {
    return new Expression(this.terms);
  }

  clone() {
    return new SqrtExpression(super.clone());
  }

  evaluate() {
    const simplified = this.simplify();
    return simplified.toTerm().evaluate();
  }

  plus(x) {
    return construct(super.plus(deconstruct(x)));
  }

  minus(x) {
    return construct(super.minus(deconstruct(x)));
  }

  times(x) {
    return construct(super.times(deconstruct(x))).simplify();
  }

  divBy(x) {
    return construct(super.divBy(deconstruct(x))).simplify();
  }

  reciprocal() {
    return new SqrtExpression(super.reciprocal());
  }

  timesMinusOne() {
    return new SqrtExpression(super.timesMinusOne());
  }
}

export class SqrtFractionExpression extends FractionExpression {
  constructor(...constructionParameters) {
    let numerator;
    let denominator;

    switch (constructionParameters.length) {
      case 2:
        numerator = constructionParameters[0];
        denominator = constructionParameters[1];
        break;

      case 1: //this is the case with a FractionExpression as constructor param
        numerator = constructionParameters[0].numerator;
        denominator = constructionParameters[0].denominator;
        break;

      default:
        console.warn('unexpected parameters in new SqrtFractionExpression');
        break;
    }
    super(numerator, denominator);
  }

  toFractionExpression() {
    return new FractionExpression(this.numerator, this.denominator);
  }

  clone() {
    return new SqrtFractionExpression(super.clone());
  }

  evaluate() {
    const simplified = this.simplify();
    return simplified.toTerm().evaluate();
  }

  plus(x) {
    return construct(super.plus(deconstruct(x)));
  }

  minus(x) {
    return construct(super.minus(deconstruct(x)));
  }

  times(x) {
    return construct(super.times(deconstruct(x))).simplify();
  }

  divBy(x) {
    return construct(super.divBy(deconstruct(x))).simplify();
  }

  reciprocal() {
    return new SqrtFractionExpression(super.reciprocal());
  }

  timesMinusOne() {
    return new SqrtFractionExpression(super.timesMinusOne());
  }
}

function construct(constructionParameter) {
  //Decides which type of sqrt to go to and constructs it
  switch (constructionParameter.constructor) {
    case Term:
      return new SquareRoot(constructionParameter);

    case Expression:
      const newExpression = new Expression(
        constructionParameter.terms.map(x => construct(x))
      );
      return new SqrtExpression(newExpression);

    case FractionExpression:
      const newNumerator = construct(constructionParameter.numerator);
      const newDenominator = construct(constructionParameter.denominator);
      return new SqrtFractionExpression(newNumerator, newDenominator);

    default:
      return constructionParameter;
  }
}

function deconstruct(deconstructionParameter) {
  //Decides which type of symbolic representation to go to and constructs it
  switch (deconstructionParameter.constructor) {
    case SquareRoot:
      return deconstructionParameter.toTerm();

    case SqrtExpression:
      return deconstructionParameter.toExpression();

    case SqrtFractionExpression:
      return deconstructionParameter.toFractionExpression();

    default:
      return deconstructionParameter;
  }
}

function reduceSqrt(sqrt, index) {
  let power;
  const powerStr = sqrt.powers[index].toString();
  if (powerStr.includes('/')) {
    power = convertFracToDecimal(powerStr);
  } else {
    power = new Decimal(powerStr);
  }

  if (power.mod(2).equals(0)) {
    return collapseSqrtIntoCoefficient(sqrt, index, power);
  } else if (power.isInt()) {
    return updateSqrtCoefficient(sqrt, index, power);
  } else {
    return specialCaseSqrtCoefficient(sqrt, index, power);
  }
}

function collapseSqrtIntoCoefficient(sqrt, index, power) {
  const sqrtArgStr = sqrt.symbols[index].slice(1);
  const factor = new Decimal(sqrtArgStr).pow(power.div(2));
  const newCoef = opValue(sqrt.coefficient.toString(), '×', factor.toString());
  const newSymbols = removeElement(sqrt.symbols, index);
  const newPowers = removeElement(sqrt.powers, index);
  return new SquareRoot(new Term(newCoef, newSymbols, newPowers));
}

function updateSqrtCoefficient(sqrt, index, power) {
  const sqrtArgStr = sqrt.symbols[index].slice(1);
  const factor = new Decimal(sqrtArgStr).pow(power.minus(1));
  const newCoef = opValue(sqrt.coefficient.toString(), '×', factor.toString());
  const newPowers = cloneState(sqrt.powers).splice(index, 1, '1');
  return new SquareRoot(new Term(newCoef, sqrt.symbols, newPowers));
}

function specialCaseSqrtCoefficient(sqrt, index, power) {
  //WiP
}
