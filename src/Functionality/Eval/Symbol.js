//const Fraction = require('fraction.js');
//import Decimal from 'decimal.js/decimal';
import { identicalArrays, cloneState } from '../Utilities';

export class Symbol {
  constructor(representation, power) {
    this.representation = representation;
    this.power = power;
  }

  multiply(matchingRepresentation) {
    const pow = this.power + matchingRepresentation.power;
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

  plus(x) {
    switch (x.constructor) {
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
      case Expression:
        const thisAsExp = new Expression([this]);
        return thisAsExp.expressionSubtract(x);

      case Term:
        const invX = new Term(x.coefficient * -1, x.symbols, x.powers);
        return this.termAdd(invX);

      default:
        return this.numAdd(-x);
    }
  }

  times(x) {
    switch (x.constructor) {
      case Expression:
        return x.termMultiply(this);

      case Term:
        return this.termMultiply(x);

      default:
        const coef = this.coefficient * x;
        return new Term(coef, this.symbols, this.powers);
    }
  }

  divBy(x) {
    switch (x.constructor) {
      case Expression:
        return x.divBy(this).reciprocal();

      case Term:
        return this.termMultiply(x.reciprocal());

      default:
        const coef = this.coefficient / x;
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
    return new Expression([this, num]);
  }

  termMultiply(term) {
    const coef = this.coefficient * term.coefficient;
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
    return new Term(1 / this.coefficient, this.symbols, invPowers);
  }
}

export class Expression {
  constructor(terms) {
    this.terms = terms;
  }

  plus(x) {
    switch (x.constructor) {
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
      case Expression:
        return this.expressionDivide(x); //WIP

      case Term:
        return this.termMultiply(x.reciprocal());

      default:
        x = new Term(1 / x, [], []);
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
    let wipTerms = new Expression(this.terms).terms[0];
    for (let i = 1; i < this.terms.length; i++) {
      wipTerms = wipTerms.plus(this.terms[i]);
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
    return new inverseExpression(this);
  }

  toString() {
    let wipString = this.terms[0].toString();
    for (let i = 1; i < this.terms.length; i++) {
      if (this.terms[i].coefficient > 0) {
        wipString += '+' + this.terms[i].toString();
      } else {
        wipString += this.terms[i].toString();
      }
    }
    return wipString;
  }
}

class inverseExpression {
  constructor(expression) {
    this.reciprocal = expression;
  }

  reciprocal() {
    return this.reciprocal();
  }

  toString() {
    return '1 / ' + this.reciprocal.toString();
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
