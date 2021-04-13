import { convertFracToDecimal, reduceDecimal } from '../Utilities';

export default function parseSymbol(symbol, displayMode) {
  return isComplexSymbol(symbol)
    ? evaluateSymbol(symbol)
    : displaySymbol(symbol, displayMode);
}

function evaluateSymbol(symbol) {
  return reduceDecimal(convertFracToDecimal(symbol.evaluate().toString()));
}

function displaySymbol(symbol, displayMode) {
  switch (displayMode) {
    case 'decimal':
      return symbol === 'π' ? Math.PI : evaluateSymbol(symbol);
    //string 'π' does not have an evaluate() method

    default:
      return symbol.toString();
  }
}

function isComplexSymbol(symbol) {
  return isFractionSymbol(symbol) && isComplexFractionSymbol(symbol);
}

function isFractionSymbol({ numerator, denominator }) {
  const exists = obj => typeof obj !== 'undefined';
  return exists(numerator) && exists(denominator);
}

function isComplexFractionSymbol({ numerator, denominator }) {
  return isComplexNumerator(numerator) || isComplexDenominator(denominator);
}

function isComplexNumerator(numerator) {
  return isComplexExpression(numerator, 1);
}

function isComplexDenominator(denominator) {
  return isComplexExpression(denominator, 0);
}

function isComplexExpression(expression, largestAllowedPower) {
  return (
    hasMixedPowers(expression) ||
    expressionHasHighPower(expression, largestAllowedPower)
  );
}

function hasMixedPowers({ terms }) {
  return terms.length > 1;
}

function expressionHasHighPower({ terms }, largestAllowedPower) {
  return terms.some(term => termHasHighPower(term, largestAllowedPower));
}

function termHasHighPower(term, largestAllowedPower) {
  return term.powers.some(power => power > largestAllowedPower);
}
