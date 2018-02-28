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
        break; //WIP

      case Term:
        const invPowers = x.powers.map(p => -p);
        const invX = new Term(1 / x.coefficient, x.symbols, invPowers);
        return this.termMultiply(invX);

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
}

export class Expression {
  constructor(terms) {
    this.terms = terms;
  }

  expPlus(x) {
    const wipTerms = cloneState(this.terms);
    console.log('s', wipTerms);
    return new Expression(wipTerms);
  }

  toString() {
    console.log('terms', this.terms);
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

function findMatchingSymbol(symbolInTerm1, term2Symbols) {
  for (let i = 0; i < term2Symbols.length; i++) {
    if (symbolInTerm1 === term2Symbols[i]) {
      return i;
    }
  }
  return null;
}
