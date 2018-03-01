const Fraction = require('fraction.js');
import { identicalArrays, cloneState } from '../Utilities';
import { opValue } from './DoArithmeticOp';

class Symbol {
  constructor(representation, power) {
    this.representation = representation;
    this.power = power;
  }

  multiply(matchingRepresentation) {
    const pow = opValue(
      this.power.toString(),
      '+',
      matchingRepresentation.power.toString()
    ); //this.power + matchingRepresentation.power;
    return new Symbol(this.representation, pow);
  }

  divide(matchingRepresentation) {
    const pow = this.power - matchingRepresentation.power;
    return new Symbol(this.representation, pow);
  }

  toString() {
    return this.representation + '^' + this.power.toString();
  }
}

export class Term {
  constructor(coefficient, symbols, powers = [1]) {
    this.coefficient = coefficient;
    this.symbols = symbols;
    this.powers = powers;
  }

  toString() {
    let wipString = '';
    for (let i = 0; i < this.symbols.length; i++) {
      wipString += this.symbols[i] + '^' + this.powers[i].toString();
    }
    return this.coefficient + wipString;
  }

  simplify() {
    const wipPowers = cloneState(this.powers);
    const wipSymbols = cloneState(this.symbols);
    for (let i = 0; i < this.symbols.length; i++) {
      if (wipPowers[i] === 0 || wipPowers[i] === '0') {
        wipSymbols.splice(i, 1);
        wipPowers.splice(i, 1);
        i--;
      }
    }
    return new Term(this.coefficient, wipSymbols, wipPowers);
  }

  plus(x) {
    switch (x.constructor) {
      case FractionExpression:
        return x.plus(this);

      case Expression:
        return x.termAdd(this);

      case Term:
        return this.termAdd(x);

      default:
        return this.numAdd(x);
    }
  }

  minus(x) {
    switch (x.constructor) {
      case FractionExpression:
        return x.timesMinusOne().plus(this);

      case Expression:
        return x.timesMinusOne().plus(this);

      case Term:
        const invX = new Term(
          opValue(x.coefficient.toString(), '×', '-1'),
          x.symbols,
          x.powers
        );
        return this.termAdd(invX);

      default:
        return this.numAdd(opValue(x.toString(), '×', '-1'));
    }
  }

  times(x) {
    switch (x.constructor) {
      case FractionExpression:
        return x.times(this);

      case Expression:
        return x.termMultiply(this);

      case Term:
        return this.termMultiply(x);

      default:
        const coef = opValue(this.coefficient.toString(), '×', x.toString()); //this.coefficient * x;
        return new Term(coef, this.symbols, this.powers);
    }
  }

  divBy(x) {
    switch (x.constructor) {
      case FractionExpression:
        return x.reciprocal().times(this);

      case Expression:
        return x.divBy(this).reciprocal();

      case Term:
        return this.termMultiply(x.reciprocal());

      default:
        const coef = opValue(this.coefficient.toString(), '/', x.toString()); //this.coefficient / x;
        return new Term(coef, this.symbols, this.powers);
    }
  }

  termAdd(term) {
    if (correspondingTerms(this, term)) {
      const coef = this.coefficient + term.coefficient;
      return new Term(coef, this.symbols, this.powers);
    } else {
      return new Expression([this, term]);
    }
  }

  numAdd(num) {
    const numTerm = new Term(num, [], []);
    return this.termAdd(numTerm);
  }

  termMultiply(term) {
    const coef = opValue(
      this.coefficient.toString(),
      '×',
      term.coefficient.toString()
    );
    let wipSymbols = cloneState(term.symbols);
    const wipPowers = cloneState(term.powers);
    let matchIndex, s, t, u;
    for (let i = 0; i < this.symbols.length; i++) {
      matchIndex = findMatchingSymbol(this.symbols[i], wipSymbols);
      if (matchIndex || matchIndex === 0) {
        s = new Symbol(this.symbols[i], this.powers[i]);
        t = new Symbol(wipSymbols[matchIndex], term.powers[matchIndex]);
        u = s.multiply(t);
        wipSymbols = wipSymbols.filter(x => x !== u.representation);
        wipPowers.splice(matchIndex, 1);
        wipSymbols.push(u.representation);
        wipPowers.push(u.power);
      } else {
        wipSymbols.push(this.symbols[i]);
        wipPowers.push(this.powers[i]);
      }
    }
    return new Term(coef, wipSymbols, wipPowers);
  }

  reciprocal() {
    const invPowers = this.powers.map(p => -p);
    return new Term(
      opValue('1', '÷', this.coefficient.toString()),
      this.symbols,
      invPowers
    );
  }
}

export class Expression {
  constructor(terms) {
    this.terms = terms;
  }

  plus(x) {
    switch (x.constructor) {
      case FractionExpression:
        return x.plus(this);

      case Expression:
        return this.expressionAdd(x);

      case Term:
        return this.termAdd(x);

      default:
        x = new Term(x, [], []);
        return this.termAdd(x);
    }
  }

  minus(x) {
    let invX;
    switch (x.constructor) {
      case FractionExpression:
        return x.timesMinusOne().plus(this);

      case Expression:
        invX = x.timesMinusOne();
        return this.expressionAdd(invX);

      case Term:
        invX = new Term(-x.coefficient, x.symbols, x.powers);
        return this.termAdd(invX);

      default:
        invX = new Term(-x, [], []);
        return this.termAdd(invX);
    }
  }

  times(x) {
    switch (x.constructor) {
      case FractionExpression:
        return x.times(this);

      case Expression:
        return this.expressionMultiply(x);

      case Term:
        return this.termMultiply(x);

      default:
        x = new Term(x, [], []);
        return this.numMultiply(x);
    }
  }

  divBy(x) {
    switch (x.constructor) {
      case FractionExpression:
        return x.reciprocal().times(this);

      case Expression:
        return new FractionExpression(this, x);

      case Term:
        return this.times(x.reciprocal());

      default:
        x = new Term(opValue('1', '×', x.toString()), [], []);
        return this.numMultiply(x);
    }
  }

  termAdd(x) {
    const wipTerms = new Expression(this.terms).terms;
    const matchIndex = findCorrespondingTerms(x, this);
    if (matchIndex || matchIndex === 0) {
      wipTerms[matchIndex] = wipTerms[matchIndex].plus(x);
    } else {
      wipTerms.push(x);
    }
    return new Expression(wipTerms);
  }

  expressionAdd(x) {
    let wipExpression = new Expression(this.terms);
    for (let i = 0; i < x.terms.length; i++) {
      wipExpression = wipExpression.termAdd(x.terms[i]);
    }
    return wipExpression;
  }

  numMultiply(num) {
    const terms = this.terms;
    return new Expression(terms.map(x => x.times(num)));
  }

  termMultiply(term) {
    const terms = this.terms;
    return new Expression(terms.map(x => x.times(term))).simplify();
  }

  expressionMultiply(exp) {
    const terms = this.terms;
    return new Expression(terms.map(x => x.times(exp))).simplify();
  }

  simplify() {
    let wipTerms = new Expression(this.terms).terms[0].simplify();
    let wipTerm;
    for (let i = 1; i < this.terms.length; i++) {
      wipTerm = this.terms[i].simplify();
      console.log('wipTerm', wipTerm);
      wipTerms = wipTerms.plus(this.terms[i].simplify());
    }
    return wipTerms;
  }

  timesMinusOne() {
    let wipTerms = new Expression(this.terms).terms[0].times(-1);
    for (let i = 1; i < this.terms.length; i++) {
      wipTerms = wipTerms.minus(this.terms[i]);
    }
    return wipTerms;
  }

  reciprocal() {
    const numerator = new Expression([new Term(1, [], [])]);
    return new FractionExpression(numerator, this);
  }

  toString() {
    let wipString = this.terms[0].toString();
    for (let i = 1; i < this.terms.length; i++) {
      if (isGreaterThan(this.terms[i].coefficient, 0)) {
        wipString += '+' + this.terms[i].toString();
      } else {
        wipString += this.terms[i].toString();
      }
    }
    return wipString;
  }
}

class FractionExpression {
  constructor(numerator, denominator) {
    this.numerator = numerator;
    this.denominator = denominator;
  }

  reciprocal() {
    return new FractionExpression(this.denominator, this.numerator);
  }

  simplify() {
    let fix = multiplyThroughNegPowers(this.numerator);
    let numerator = fix.expression;
    let denominator = this.denominator.times(fix.factor);
    fix = multiplyThroughNegPowers(denominator);
    numerator = numerator.times(fix.factor).simplify();
    denominator = fix.expression.simplify();
    return new FractionExpression(numerator, denominator);
  }

  timesMinusOne() {
    return new FractionExpression(
      this.denominator.timesMinusOne(),
      this.numerator
    );
  }

  plus(x) {
    let newNumer;
    switch (x.constructor) {
      case FractionExpression:
        newNumer = this.numerator
          .times(x.denominator)
          .plus(x.numerator.times(this.denominator))
          .simplify();
        const newDenom = this.denominator.times(x.denominator).simplify();
        return new FractionExpression(newNumer, newDenom);

      default:
        newNumer = this.numerator.plus(this.denominator.times(x)).simplify();
        return new FractionExpression(newNumer, this.denominator);
    }
  }

  minus(x) {
    let newNumer;
    switch (x.constructor) {
      case FractionExpression:
        newNumer = this.numerator
          .times(x.denominator)
          .minus(x.numerator.times(this.denominator))
          .simplify();
        const newDenom = this.denominator.times(x.denominator).simplify();
        return new FractionExpression(newNumer, newDenom);

      default:
        newNumer = this.numerator.minus(this.denominator.times(x)).simplify();
        return new FractionExpression(newNumer, this.denominator);
    }
  }

  times(x) {
    let newNumer;
    switch (x.constructor) {
      case FractionExpression:
        newNumer = this.numerator.times(x.numerator).simplify();
        const newDenom = this.denominator.times(x.denominator).simplify();
        return new FractionExpression(newNumer, newDenom);

      default:
        newNumer = this.numerator.times(x);
        return new FractionExpression();
    }
  }

  divBy(x) {
    switch (x.constructor) {
      case Number:
        return this.times(1 / x);

      default:
        return this.times(x.reciprocal());
    }
  }

  toString() {
    return (
      '\\frac' +
      '{' +
      this.numerator.toString() +
      '} {' +
      this.denominator.toString() +
      '}'
    );
  }
}

function correspondingTerms(term1, term2) {
  if (
    identicalArrays(term1.symbols, term2.symbols) &&
    identicalArrays(term1.powers, term2.powers)
  ) {
    return true;
  } else {
    return false;
  }
}

function findCorrespondingTerms(term, expression) {
  for (let i = 0; i < expression.terms.length; i++) {
    if (correspondingTerms(term, expression.terms[i])) {
      return i;
    }
  }
  return null;
}

function findMatchingSymbol(symbolInTerm1, term2Symbols) {
  for (let i = 0; i < term2Symbols.length; i++) {
    if (symbolInTerm1 === term2Symbols[i]) {
      return i;
    }
  }
  return null;
}

function multiplyThroughNegPowers(expression) {
  let fixFactor = new Term(1, [], []);
  const terms = expression.terms;
  for (let i = 0; i < terms.length; i++) {
    fixFactor = fixFactor.times(factorToFixNegPowersInTerm(terms[i]));
  }
  return {
    expression: expression.times(fixFactor).simplify(),
    factor: fixFactor
  };
}

function factorToFixNegPowersInTerm(term) {
  let factor;
  let fixFactor = new Term(1, [], []);
  for (let i = 0; i < term.powers.length; i++) {
    if (term.powers[i] < 0) {
      factor = new Term(1, [term.symbols[i]], [-term.powers[i]]);
      fixFactor = fixFactor.times(factor);
    }
  }
  return fixFactor;
}

function isGreaterThan(lhs, rhs) {
  const lhsStr = lhs.toString();
  if (lhsStr.includes('/')) {
    const lhsFrac = new Fraction(lhsStr);
    return lhsFrac.n / lhsFrac.d > rhs;
  } else {
    return lhs > rhs;
  }
}
