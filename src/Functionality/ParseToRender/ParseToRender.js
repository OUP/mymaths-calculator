//Map elements in an array to a TeX string, which is rendered as maths by KaTeX
import katex from 'katex';
import buttonType from '../ButtonType';
import { assembleNumbers, assembleArguments } from '../Utilities';
import TeXMaps from './TeXMaps';

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

  return arr
    .map(parseElToTeX, displayMode)
    .join('')
    .toString();
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
      return TeXMaps.parseNumber(el, this); //this is the displayMode

    case 'operator':
      return TeXMaps.parseOperator(el);

    case 'symbol':
    case 'sqrt':
      return TeXMaps.parseSymbol(el, this); //this is the displayMode

    case 'Ans':
      return TeXMaps.parseAns;

    case 'function':
      return parseFunc(el);

    case 'cArg':
    case 'oArg':
      return ''; //hidden characters

    case '|':
      return TeXMaps.parseCursor;

    default:
      console.error('unexpected character', el);
      return TeXMaps.parseError;
  }
}

function parseFunc(func) {
  let arg;
  let preArg;

  if (func.argument) {
    arg = prepareArg(func.argument);
  }
  if (func.preArgument) {
    preArg = prepareArg(func.preArgument);
  }

  switch (func.function) {
    case 'numerator':
      return '\\large \\frac {' + parseToTeX(arg) + '}';

    case 'denominator':
      return '{' + parseToTeX(arg) + '} \\normalsize';

    case '√(x)':
      return '\\sqrt {' + parseToTeX(arg) + '}';

    case '(':
      if (safeArgClosed(func)) {
        return '\\left(' + parseToTeX(arg) + '\\right)';
      } else {
        return '(' + parseToTeX(func.argument);
      }

    case 'base':
      return parseToTeX(arg);

    case 'exponent':
      return '^{' + parseToTeX(arg) + '}';

    case 'xⁿ':
      return preArg + '^{' + parseToTeX(arg) + '}';

    default:
      if (safeArgClosed(func)) {
        return (
          TeXMaps.funcToTeXMap(func.function) +
          '\\left(' +
          parseToTeX(arg) +
          '\\right)'
        );
      } else if (func !== ')' && func !== 'cArg' && func !== 'box') {
        return (
          TeXMaps.funcToTeXMap(func.function) +
          '(' +
          parseToTeX(func.argument, this)
        );
      } else {
        switch (func) {
          case ')':
            return ')';

          case 'box':
            return '{\\Box}';
        }
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
