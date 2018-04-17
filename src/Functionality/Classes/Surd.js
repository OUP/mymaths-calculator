import Decimal from 'decimal.js/decimal';
import { Term, Expression, FractionExpression } from './Symbol';
import { numericOp } from '../Eval/NumericOp';
import { accurateFunc } from '../Eval/AccurateMaths';
import {
  cloneState,
  convertFracToDecimal,
  removeElement,
  makeString
} from '../Utilities';
import { generateFactors } from '../Eval/GenerateFactors';

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

  toSymbol() {
    return new Term(this.coefficient, this.symbols, this.powers);
  }

  toString() {
    const simplified = this.simplify();
    if (simplified.symbols.length) {
      switch (simplified.coefficient.toString()) {
        case '1':
          return `\\sqrt ${simplified.symbols[0].slice(1)}`;

        case '-1':
          return `-\\sqrt ${simplified.symbols[0].slice(1)}`;

        case '0':
          return '0';

        default:
          return `${
            simplified.coefficient
          } \\sqrt ${simplified.symbols[0].slice(1)}`;
      }
    } else {
      return makeString(simplified.coefficient);
    }
  }

  conString() {
    return 'SquareRoot';
  }

  clone() {
    return new SquareRoot(super.clone());
  }

  evaluate() {
    const simplified = this.simplify();
    if (simplified.toSymbol) {
      return simplified.toSymbol().evaluate();
    } else {
      return simplified.evaluate();
    }
  }

  simplify() {
    let currentSqrt = new SquareRoot(super.simplify());
    currentSqrt = removeSqrtPowers(currentSqrt);
    if (currentSqrt.constructor === SquareRoot) {
      currentSqrt = combineSqrts(currentSqrt);
      if (currentSqrt.constructor === SquareRoot) {
        return pullOutSquareFactors(currentSqrt);
      }
    }
    const term = currentSqrt;
    return term;
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

  toSymbol() {
    return new Expression(this.terms);
  }

  conString() {
    return 'SqrtExpression';
  }

  simplify() {
    return construct(super.simplify());
  }

  clone() {
    return new SqrtExpression(super.clone());
  }

  evaluate() {
    const simplified = this.simplify();
    return simplified.toSymbol().evaluate();
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

  toSymbol() {
    return new FractionExpression(this.numerator, this.denominator);
  }

  simplify() {
    return construct(super.simplify());
  }

  conString() {
    return 'SqrtFractionExpression';
  }

  clone() {
    return new SqrtFractionExpression(super.clone());
  }

  evaluate() {
    const simplified = this.simplify();
    return simplified.toSymbol().evaluate();
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
      if (constructionParameter.terms.length) {
        const newExpression = new Expression(
          constructionParameter.terms.map(x => construct(x))
        );
        return new SqrtExpression(newExpression);
      } else {
        return new SqrtExpression(new Term('0'));
      }

    case FractionExpression:
      const newNumerator = construct(constructionParameter.numerator);
      if (newNumerator.evaluate().toString() === '0') {
        const zero = new Expression(new Term('0'));
        const one = new Expression(new Term('1'));
        return new SqrtFractionExpression(zero, one);
      } else {
        const newDenominator = construct(constructionParameter.denominator);
        return new SqrtFractionExpression(newNumerator, newDenominator);
      }

    default:
      return constructionParameter;
  }
}

function deconstruct(deconstructionParameter) {
  //Decides which type of symbolic representation to go to and constructs it
  switch (deconstructionParameter.constructor) {
    case SquareRoot:
    case SqrtExpression:
    case SqrtFractionExpression:
      return deconstructionParameter.toSymbol();

    default:
      return deconstructionParameter;
  }
}

function reduceSqrt(sqrt, index) {
  let power;
  const powerStr = makeString(sqrt.powers[index]);
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
    return nonIntSqrtPowerToCoef(sqrt, index, power); //WiP
  }
}

function combineSqrts(sqrt) {
  const sqrtFactors = getSqrtArgs(sqrt);
  if (sqrtFactors.length) {
    const multiplier = (accumulator, currentValue) =>
      numericOp(makeString(accumulator), '×', makeString(currentValue));
    const newSqrt = '√' + sqrtFactors.reduce(multiplier);
    return new SquareRoot(new Term(sqrt.coefficient, newSqrt, [1]));
  } else {
    return new Term(sqrt.coefficient);
  }
}

function getSqrtArgs(sqrt) {
  const sqrtArgs = [];
  const sqrts = sqrt.symbols;
  for (let i = 0; i < sqrts.length; i++) {
    sqrtArgs.push(sqrts[i].slice(1));
  }
  return sqrtArgs;
}

function pullOutSquareFactors(sqrt) {
  const sqrtArg = sqrt.symbols[0].slice(1);
  const argFactors = generateFactors(parseFloat(sqrtArg));
  const output = getDuplicateFactors(argFactors);
  const newCoef = numericOp(
    makeString(sqrt.coefficient),
    '×',
    makeString(output.coefMultiplier)
  );
  if (output.factors.length) {
    const multiplier = (accumulator, currentValue) =>
      numericOp(makeString(accumulator), '×', makeString(currentValue));
    const newSqrt = '√' + output.factors.reduce(multiplier);
    return new SquareRoot(new Term(newCoef, [newSqrt], [1]));
  } else {
    return new Term(newCoef);
  }
}

function getDuplicateFactors(factors) {
  const reducedFactors = cloneState(factors);
  let coefMultiplier = '1';
  for (let i = 0; i < reducedFactors.length; i++) {
    if (safeCompare(reducedFactors[i], reducedFactors[i + 1])) {
      coefMultiplier = numericOp(coefMultiplier, '×', reducedFactors[i]);
      reducedFactors.splice(i, 2);
      i--;
    }
  }
  return { coefMultiplier: coefMultiplier, factors: reducedFactors };
}

function safeCompare(el1, el2) {
  if (typeof el1 !== 'undefined' && typeof el2 !== 'undefined') {
    return el1.toString() === el2.toString();
  } else {
    return false;
  }
}

function removeSqrtPowers(sqrt) {
  let newSqrt = sqrt.clone();
  for (let i = 0; i < newSqrt.symbols.length; i++) {
    if (newSqrt.symbols[i].includes('√')) {
      newSqrt = reduceSqrt(newSqrt, i);
    }
  }
  return newSqrt;
}

function collapseSqrtIntoCoefficient(sqrt, index, power) {
  const sqrtArgStr = sqrt.symbols[index].slice(1);
  const factor = intPower(sqrtArgStr, makeString(numericOp(power, '÷', '2')));
  const newCoef = numericOp(
    makeString(sqrt.coefficient),
    '×',
    makeString(factor)
  );
  const newSymbols = removeElement(sqrt.symbols, index);
  const newPowers = removeElement(sqrt.powers, index);
  if (newSymbols.length) {
    return new SquareRoot(new Term(newCoef, newSymbols, newPowers));
  } else {
    return new Term(newCoef, newSymbols, newPowers);
  }
}

function updateSqrtCoefficient(sqrt, index, power) {
  const sqrtArgStr = sqrt.symbols[index].slice(1);
  const factor = intPower(
    sqrtArgStr,
    numericOp(makeString(numericOp(power, '–', '1')), '÷', '2')
  );
  const newCoef = numericOp(
    makeString(sqrt.coefficient),
    '×',
    makeString(factor)
  );
  const newPowers = cloneState(sqrt.powers);
  newPowers.splice(index, 1, '1');
  return new SquareRoot(new Term(newCoef, sqrt.symbols, newPowers));
}

function nonIntSqrtPowerToCoef(sqrt, index, power) {
  //WiP
}

function intPower(baseStr, exponentStr) {
  return accurateFunc('base', baseStr, exponentStr);
}
