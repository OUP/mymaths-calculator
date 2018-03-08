export function substitute(symbolsArray) {
  const substitutionsArray = [];
  for (let i = 0; i < symbolsArray.length; i++) {
    substitutionsArray.push(symbolValue(symbolsArray[i]));
  }
  return substitutionsArray;
}

function symbolValue(symbol) {
  switch (symbol) {
    case 'π':
      return Math.PI;

    default:
      return 0;
  }
}
