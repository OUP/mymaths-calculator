const Fraction = require('fraction.js');
import { identicalArrays, cloneState } from '../Utilities';
import { opValue } from './DoArithmeticOp';
import { generateFactors } from './GenerateFactors';
import { substitute } from './Substitute';

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
  constructor(coefficient, symbols = [], powers = []) {
    this.coefficient = coefficient;
    this.symbols = symbols;
    this.powers = powers;
    Object.freeze(this);
    Object.freeze(this.coefficient);
    Object.freeze(this.symbols);
    Object.freeze(this.powers);
  }

  clone() {
    const coefficient = this.coefficient;
    const symbols = this.symbols;
    const powers = this.powers;
    return new Term(coefficient, symbols, powers);
  }

  evaluate() {
    let result = 1,
      multiplier = 1;
    const symbolValues = substitute(this.symbols);
    for (let i = 0; i < symbolValues.length; i++) {
      multiplier = opValue(symbolValues[i], 'xⁿ', this.powers[i]);
      result = opValue(result.toString(), '×', multiplier.toString());
    }
    return opValue(
      this.coefficient.toString(),
      '×',
      result.toString()
    ).toString();
  }

  toString() {
    let wipString = '',
      power;
    for (let i = 0; i < this.symbols.length; i++) {
      power = this.powers[i];
      if (power === 1) {
        wipString += this.symbols[i];
      } else {
        wipString += this.symbols[i] + '^{' + this.powers[i].toString() + '}';
      }
    }
    if (this.coefficient.toString() === '1' && this.powers.length) {
      return wipString;
    } else if (this.coefficient.toString().includes('/')) {
      const frac = new Fraction(this.coefficient.toString());
      return (
        '\\frac {' +
        skipOne(frac.n.toString()) +
        wipString +
        '}' +
        '{' +
        frac.d.toString() +
        '}'
      );
    } else {
      return this.coefficient.toString() + wipString;
    }
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
      const coef = opValue(
        this.coefficient.toString(),
        '+',
        term.coefficient.toString()
      );
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
    let invPowers = [];
    if (this.powers.length) {
      invPowers = this.powers.map(p => -p);
    }
    return new Term(
      opValue('1', '÷', this.coefficient.toString()),
      this.symbols,
      invPowers
    );
  }
}

export class Expression {
  constructor(terms) {
    if (terms.constructor !== Array) {
      this.terms = [terms];
    } else {
      this.terms = [];
      for (let i = 0; i < terms.length; i++) {
        this.terms.push(terms[i].clone());
      }
    }
    Object.freeze(this);
    Object.freeze(this.terms);
  }

  clone() {
    const cloneTerms = [];
    for (let i = 0; i < this.terms.length; i++) {
      cloneTerms.push(this.terms[i].clone());
    }
    return new Expression(cloneTerms);
  }

  evaluate() {
    let runningValue = 0;
    for (let i = 0; i < this.terms.length; i++) {
      runningValue = opValue(
        runningValue.toString(),
        '+',
        this.terms[i].evaluate()
      );
    }
    return runningValue.toString();
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
    const terms = this.clone().terms;
    const wipTerms = [];
    for (let i = 0; i < terms.length; i++) {
      wipTerms.push(terms[i]);
    }
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
    return new Expression(terms.map(x => x.times(term)));
  }

  expressionMultiply(exp) {
    const thisExp = this.clone();
    const expTerms = exp.clone().terms;
    let adder;
    let cumExp = new Term(0);
    for (let i = 0; i < expTerms.length; i++) {
      adder = thisExp.times(expTerms[i]);
      cumExp = cumExp.plus(adder);
    }
    return cumExp.simplify();
  }

  simplify() {
    const thisExp = this.clone();
    let wipExp = thisExp.terms[0].simplify();
    let adder;
    for (let i = 1; i < this.terms.length; i++) {
      adder = thisExp.terms[i].simplify();
      wipExp = wipExp.plus(adder);
    }
    return filterZeroes(wipExp);
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
      } else if (!isEqualTo(this.terms[i].coefficient, 0)) {
        wipString += this.terms[i].toString();
      } else {
        //do nothing
      }
    }
    if (wipString === '') {
      return '0';
    } else {
      return wipString;
    }
  }
}

export class FractionExpression {
  constructor(numerator, denominator) {
    if (numerator.constructor === Term) {
      numerator = new Expression([numerator]);
    }
    if (denominator.constructor === Term) {
      denominator = new Expression([denominator]);
    }
    this.numerator = numerator;
    this.denominator = denominator;
  }

  reciprocal() {
    return new FractionExpression(this.denominator, this.numerator);
  }

  evaluate() {
    return opValue(
      this.numerator.evaluate(),
      '÷',
      this.denominator.evaluate()
    ).toString();
  }

  simplify() {
    let simplified = removeNegPowers(this);
    simplified = cancelPowers(simplified);
    simplified = removeFracCoefs(simplified);
    return cancelCoefs(simplified);
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
        return new FractionExpression(newNumer, this.denominator);
    }
  }

  divBy(x) {
    if (checkNumber(x)) {
      return this.times(opValue('1', '÷', x.toString()));
    } else {
      return this.times(x.reciprocal());
    }
  }

  toString() {
    const denomString = this.denominator.toString();
    if (denomString === '1') {
      return this.numerator.toString();
    } else {
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
}

function checkNumber(x) {
  if (x.constructor === Number) {
    return true;
  } else if (x.d !== 'undefined') {
    return true;
  } else {
    return false;
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

function isEqualTo(lhs, rhs) {
  const lhsStr = lhs.toString();
  if (lhsStr.includes('/')) {
    const lhsFrac = new Fraction(lhsStr);
    return lhsFrac.n / lhsFrac.d === rhs;
  } else {
    return lhsStr === rhs.toString();
  }
}

function removeNegPowers(fracExpression) {
  let fix = multiplyThroughNegPowers(fracExpression.numerator);
  let numerator = fix.expression;
  let denominator = fracExpression.denominator.times(fix.factor);
  fix = multiplyThroughNegPowers(denominator);
  numerator = numerator.times(fix.factor).simplify();
  denominator = fix.expression.simplify();
  return new FractionExpression(numerator, denominator);
}

function removeFracCoefs(fracExpression) {
  let fix = multiplyThroughDenomCoefs(fracExpression.numerator);
  let numerator = fix.expression;
  let denominator = fracExpression.denominator.times(fix.factor);
  fix = multiplyThroughDenomCoefs(denominator);
  numerator = numerator.times(fix.factor).simplify();
  denominator = fix.expression.simplify();
  return new FractionExpression(numerator, denominator);
}

function multiplyThroughDenomCoefs(expression) {
  let fixFactor = new Term(1, [], []);
  const terms = expression.terms;
  for (let i = 0; i < terms.length; i++) {
    fixFactor = fixFactor.times(factorToFixFracCoefInTerm(terms[i]));
  }
  return {
    expression: expression.times(fixFactor).simplify(),
    factor: fixFactor
  };
}

function factorToFixFracCoefInTerm(term) {
  const coefStr = term.coefficient.toString();
  if (checkFraction(coefStr)) {
    return new Fraction(coefStr).d;
  } else {
    return 1;
  }
}

function checkFraction(coefStr) {
  if (coefStr.includes('/') || coefStr.includes('.')) {
    return true;
  } else {
    return false;
  }
}

function cancelCoefs(fracExpression) {
  const terms = fracExpression.numerator.terms.concat(
    fracExpression.denominator.terms
  );
  let coefficients = [];
  for (let i = 0; i < terms.length; i++) {
    coefficients.push(terms[i].coefficient);
  }
  coefficients = removeCommonFactors(coefficients);
  for (let i = 0; i < terms.length; i++) {
    coefficients[i] = recombineFactors(coefficients[i]);
  }

  const newTerms = [];
  for (let i = 0; i < terms.length; i++) {
    newTerms.push(new Term(coefficients[i], terms[i].symbols, terms[i].powers));
  }
  const numerator = new Expression(
    terms.slice(0, fracExpression.numerator.terms.length)
  );
  const denominator = new Expression(
    terms.slice(fracExpression.numerator.terms.length, terms.length + 1)
  );
  return new FractionExpression(numerator, denominator);
}

const inHCF = function(factor, coefficients) {
  let rtn = true;
  for (let i = 0; i < coefficients.length; i++) {
    rtn = rtn && coefficients[i].includes(factor);
    if (rtn === false) {
      return rtn;
    }
  }
  return rtn;
};

function removeCommonFactors(coefficients) {
  let newCoefficients = cloneState(coefficients);
  for (let i = 0; i < coefficients.length; i++) {
    newCoefficients[i] = generateFactors(coefficients[i]);
  }
  const allPrimeFactors = mergeArrays(newCoefficients);
  for (let i = 0; i < allPrimeFactors.length; i++) {
    newCoefficients = removeFactor(allPrimeFactors[i], newCoefficients);
  }
  console.log('newCoefficients', newCoefficients);
  return newCoefficients;
}

function removeFactor(factor, coefficients) {
  const factorIndex = [];
  for (let i = 0; i < coefficients.length; i++) {
    if (coefficients[i].indexOf(factor) >= 0) {
      factorIndex.push(coefficients[i].indexOf(factor));
    } else {
      console.log('here', coefficients[i]);
    }
    console.log(factorIndex, coefficients);
  }
  if (factorIndex.length === coefficients.length) {
    for (let i = 0; i < coefficients.length; i++) {
      coefficients[i].splice(factorIndex[i], 1);
    }
  }
  return coefficients;
}

function recombineFactors(factorsArray) {
  if (factorsArray.length) {
    return factorsArray.reduce(
      (accumulator, currentValue) => accumulator * currentValue
    );
  } else {
    return [1];
  }
}

function mergeArrays(coefficients) {
  return coefficients.reduce((accumulator, currentValue) =>
    currentValue.concat(accumulator)
  );
}

function cancelPowers(fracExpression) {
  const allTerms = fracExpression.numerator.terms.concat(
    fracExpression.denominator.terms
  );
  const firstTerm = allTerms[0];
  let symbol;
  for (let i = 0; i < firstTerm.symbols.length; i++) {
    symbol = firstTerm.symbols[i];
    const factorInAllTerms = getFactorInAllTerms(symbol, allTerms);
    if (factorInAllTerms) {
      const numerator = fracExpression.numerator.divBy(factorInAllTerms);
      const denominator = fracExpression.denominator.divBy(factorInAllTerms);
      fracExpression = new FractionExpression(numerator, denominator);
    }
  }
  return fracExpression;
}

function getFactorInAllTerms(symbol, allTerms) {
  let index = allTerms[0].symbols.indexOf(symbol);
  let power = allTerms[0].powers[index];
  let comparePower;
  for (let i = 1; i < allTerms.length; i++) {
    index = allTerms[i].symbols.indexOf(symbol);
    if (index >= 0) {
      comparePower = allTerms[i].powers[index];
      if (comparePower < power) {
        power = comparePower;
      }
    } else {
      return null;
    }
  }
  return new Term(1, [symbol], [power]);
}

function skipOne(str) {
  if (str === '1') {
    return '';
  } else {
    return str;
  }
}

function filterZeroes(expression) {
  const terms = expression.clone().terms;
  if (terms.length === 1) {
    return expression;
  }

  const coefficients = [];
  for (let i = 0; i < terms.length; i++) {
    coefficients.push(terms[i].coefficient.toString());
  }

  let index;
  for (let i = 0; i < coefficients.length; i++) {
    index = coefficients.indexOf('0');
    console.log('terms', terms, index);
    if (index >= 0) {
      terms.splice(index, 1);
    }
  }

  return new Expression(terms);
}
