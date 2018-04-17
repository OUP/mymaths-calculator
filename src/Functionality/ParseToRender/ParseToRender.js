//Map elements in an array to a TeX string, which is rendered as maths by KaTeX
import katex from 'katex';
import buttonType from '../ButtonType';
import { assembleNumbers, assembleArguments } from '../Utilities';
import TeX from './TeXMaps';

export function parseToRender(
  arr,
  id,
  cursorPosition = -1,
  displayMode = 'default'
) {
  const maths = parseToTeX(arr, cursorPosition, displayMode);
  katex.render(maths, document.getElementById(id));
}

function parseToTeX(arr, cursorPosition = -1, displayMode = 'default') {
  if (arr.length > 1) {
    if (cursorPosition >= 0) {
      arr = addCursor(arr, cursorPosition);
    }
    arr = assembleNumbers(arr);
    arr = assembleArguments(arr);
  }

  return `{${arr
    .map(parseElToTeX, displayMode)
    .join('')
    .toString()}}`;
}

function addCursor(arr, position) {
  arr = arr.filter(x => x !== '|');
  arr.splice(position, 0, '|');
  return arr;
}

function parseElToTeX(el) {
  const bType = buttonType(el);
  switch (bType) {
    case 'number':
      return TeX.number(el, this); //this is the displayMode

    case 'operator':
      return TeX.operator(el);

    case 'symbol':
    case 'sqrt':
      return TeX.symbol(el, this); //this is the displayMode

    case 'Ans':
      return TeX.ans;

    case 'function':
      return parseFunc(el);

    case 'cArg':
    case 'oArg':
      return ''; //hidden characters

    case '|':
      return TeX.cursor;

    default:
      console.error('unexpected character', el);
      return TeX.error;
  }
}

function parseFunc(func) {
  let arg;

  if (func.argument) {
    arg = prepareArg(func.argument);
  }

  switch (func.function) {
    case 'numerator':
    case '√(x)':
    case 'exponent':
      return `${TeX.func(func.function)} ${parseToTeX(arg)}`;

    case 'denominator':
      return `${parseToTeX(arg)} \\normalsize`;

    case '(':
      if (safeArgClosed(func)) {
        return `${TeX.openBracket} ${parseToTeX(arg)} ${TeX.closeBracket}`;
      } else {
        return `( ${parseToTeX(func.argument)}`;
      }

    case 'base': //always goes with exponent
      return parseToTeX(arg);

    default:
      return parseDefaultFunc(func, arg);
  }
}

function parseDefaultFunc(func, arg) {
  if (safeArgClosed(func)) {
    return `${TeX.func(func.function)}
      ${TeX.openBracket}
      ${parseToTeX(arg)}
      ${TeX.closeBracket}`;
  } else if (func !== ')' && func !== 'cArg' && func !== 'box') {
    return `${TeX.func(func.function)} ( ${parseToTeX(func.argument, this)}`;
  } else {
    switch (func) {
      case ')':
        return ')';

      case 'box':
        return TeX.box;
    }
  }
}

function prepareArg(arg) {
  let updatedArg = arg.filter(x => x !== ')');
  updatedArg = updatedArg.filter(x => buttonType(x) !== 'cArg');
  return boxIfArgEmpty(updatedArg);
}

function boxIfArgEmpty(dispArg) {
  if (!dispArg.length) {
    dispArg = ['box'];
  } else if (dispArg.length === 1 && dispArg[0] === '|') {
    dispArg.push('box');
  }
  return dispArg;
}

function safeArgClosed(el) {
  if (el) {
    if (el.argument) {
      if (el.argument.includes(')')) {
        return true;
      }
    }
  }
  return false;
}
