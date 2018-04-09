import Decimal from 'decimal.js/decimal';

export function substitute(symbolsArray) {
  const substitutionsArray = [];
  for (let i = 0; i < symbolsArray.length; i++) {
    substitutionsArray.push(symbolValue(symbolsArray[i]));
  }
  return substitutionsArray;
}

function symbolValue(symbol) {
  switch (true) {
    case symbol === 'π':
      return Math.PI;

    case symbol.includes('√'):
      const arg = new Decimal(symbol.slice(1));
      return arg.sqrt();

    default:
      return 0;
  }
}
