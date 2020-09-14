import buttonType from '../ButtonType';

export function moreOpsToDo(inputArray) {
  if (inputArray.length > 1 || inputArray[0].argument) {
    return true;
  } else {
    return false;
  }
}

export function findNextOp(inputArray) {
  let prioritisedArray;

  //Skip prioritise ops if already prioritised
  if (!inputArray[0].priority && inputArray[0].priority !== 0) {
    prioritisedArray = prioritiseOps(inputArray);
  } else {
    prioritisedArray = inputArray;
  }

  const output = {};
  let i;
  let j;

  for (i = 1; i <= 7; i++) {
    for (j = 0; j < prioritisedArray.length; j++) {
      if (prioritisedArray[j].priority === i) {
        output.array = prioritisedArray;
        output.position = j;
        return output;
      }
    }
  }

  console.error('findNextOp expected an op.');
  return inputArray;
}

function prioritiseOps(inputArray) {
  const prioritised = [];
  let element = {};
  let i;
  for (i = 0; i < inputArray.length; i++) {
    element.value = inputArray[i];
    element.type = buttonType(inputArray[i]);
    element.priority = opPriority(element);
    prioritised.push(element);
    element = {};
  }
  return prioritised;
}

export function opPriority(element) {
  if (element.type === 'function') {
    return 1;
  } else if (element.type !== 'operator') {
    return 0;
  } else {
    switch (element.value) {
      case 'mixedFraction':
        return 2;

      case 'xⁿ':
        return 3;

      case 'x!':
        return 3;

      case '%':
        return 3;
      //Strictly should be 4 but setting it to 2 is an auto-correct

      case 'nPr':
        return 4;

      case 'nCr':
        return 4;

      case '÷':
        return 5;

      case '×':
        return 6;

      case '×10ⁿ':
        return 6;

      case '–':
        return 7;

      case '+':
        return 8;

      default:
        console.error("Don't know the priority of " + element.value);
        break;
    }
  }
}
