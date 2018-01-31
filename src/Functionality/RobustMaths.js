//Adds in some fixes to buggy js floating point arithmetic
export function robustOp(v1, operation, v2) {
  switch (operation) {
    case 'xⁿ':
      return pow(v1, v2);

    case '÷':
      return divide(v1, v2);

    case '×':
      return multiply(v1, v2);

    case '×10ⁿ':
      return pow10(v1, v2);
    //v1 * Math.pow(10, v2);

    case '–':
      return subtract(v1, v2);

    case '+':
      return add(v1, v2);

    default:
      console.error("Don't know how to do the operation " + operation);
      return ['error'];
  }
}

export function robustFunc(func, arg) {
  switch (func) {
    case '|x|':
      return Math.abs(arg);

    case 'log(x)':
      return Math.log10(arg);

    case 'ln(x)':
      return Math.log(arg);

    case '√(x)':
      return Math.sqrt(arg);

    case 'sin(x)':
      return Math.sin(arg);

    case 'cos(x)':
      return Math.cos(arg);

    case 'tan(x)':
      return Math.tan(arg);

    case '(':
      return arg;
  }
}

//Multiplies by 10 on a loop until float is an int
function floatToInt(float) {
  let testNum = float;
  let numDp = 0;
  while (testNum !== Math.round(testNum)) {
    testNum *= 10;
    numDp++;
  }
  return { value: testNum, numDp: numDp };
}

//Reverses floatToInt
function intToFloat(int) {
  let float = int.value;
  let i;
  for (i = 0; i < int.numDp; i++) {
    float /= 10;
  }
  return float;
}

//v1 + v2
function add(v1, v2) {
  const int1 = floatToInt(v1);
  const int2 = floatToInt(v2);
  const maxDp = Math.max(int1.numDp, int2.numDp);
  const dpDif = Math.abs(int1.numDp - int2.numDp);

  if (maxDp === int1.numDp) {
    int2.value *= Math.pow(10, dpDif);
  } else {
    int1.value *= Math.pow(10, dpDif);
  }

  const intResult = {};
  intResult.numDp = maxDp;
  intResult.value = int1.value + int2.value;
  const result = intToFloat(intResult);
  return result;
}

//v1 - v2
function subtract(v1, v2) {
  const int1 = floatToInt(v1);
  const int2 = floatToInt(v2);
  const maxDp = Math.max(int1.numDp, int2.numDp);
  const dpDif = Math.abs(int1.numDp - int2.numDp);

  if (maxDp === int1.numDp) {
    int2.value *= Math.pow(10, dpDif);
  } else {
    int1.value *= Math.pow(10, dpDif);
  }

  const intResult = {};
  intResult.numDp = maxDp;
  intResult.value = int1.value - int2.value;
  const result = intToFloat(intResult);
  return result;
}

//v1 * v2
function multiply(v1, v2) {
  const int1 = floatToInt(v1);
  const int2 = floatToInt(v2);
  const intResult = {};
  intResult.value = int1.value * int2.value;
  intResult.numDp = int1.numDp + int2.numDp;
  const result = intToFloat(intResult);
  return result;
}

//v1 / v2
//This is still buggy. Will be better once fractions are implemented.
function divide(v1, v2) {
  const int1 = floatToInt(v1);
  const int2 = floatToInt(v2);
  const intResult = {};
  intResult.value = int1.value / int2.value;
  intResult.numDp = int1.numDp - int2.numDp;
  const result = intToFloat(intResult);
  return result;
}

//v1 ^ v2
function pow(v1, v2) {
  let i;
  let result = 1;
  if (Math.round(v2) === v2) {
    if (v2 > 0) {
      for (i = 1; i <= v2; i++) {
        result = multiply(result, v1);
      }
    } else {
      for (i = -1; i >= v2; i--) {
        result = divide(result, v1);
      }
    }
    return result;
  } else {
    return Math.pow(v1, v2);
  }
}

function pow10(v1, v2) {
  const int2 = floatToInt(v2);
  const intResult = floatToInt(v1);
  let i;

  if (v2 === int2.value) {
    if (v2 >= 0) {
      for (i = 0; i < v2; i++) {
        intResult.value *= 10;
      }
    } else {
      for (i = 0; i > v2; i--) {
        console.log('intResult.value', intResult.value);
        intResult.value /= 10;
      }
    }
    return intToFloat(intResult);
  } else {
    return v1 * Math.pow(10, v2);
  }
}
