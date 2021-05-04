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
      return new Decimal('3.14159265358979323846264338327950288');

    case symbol.includes('√'):
      const arg = new Decimal(symbol.slice(1));
      return arg.sqrt();

    default:
      return 0;
  }
}
