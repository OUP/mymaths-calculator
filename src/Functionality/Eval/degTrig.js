import { sqrtFactory } from '../Classes/Surd';

export default function degTrig(trigFunc, arg) {
  const floatArg = parseFloat(arg.toString());
  return isSpecialValue(floatArg)
    ? specialValueTrig(trigFunc, floatArg)
    : standardTrigFunc(trigFunc, arg);
}

function isSpecialValue(floatArg) {
  return floatArg % 30 === 0 || floatArg % 45 === 0;
}

function specialValueTrig(trigFunc, floatArg) {
  floatArg = reduceFloatArg(floatArg);
  switch (trigFunc) {
    case 'sin':
      return specialValueSin(floatArg);

    case 'cos':
      return specialValueCos(floatArg);

    case 'tan':
      return specialValueTan(floatArg);
  }
}

function reduceFloatArg(floatArg) {
  while (floatArg > 360) {
    floatArg -= 360;
  }
  while (floatArg < 0) {
    floatArg += 360;
  }
  return floatArg;
}

function specialValueSin(floatArg) {
  switch (floatArg) {
    case 0:
    case 180:
    case 360:
      return 0;

    case 30:
    case 150:
      return 0.5;

    case 45:
    case 135:
      return sqrtFactory('√2').div(2);

    case 60:
    case 120:
      return sqrtFactory('√3').div(2);

    case 90:
      return 1;

    case 210:
    case 330:
      return -0.5;

    case 225:
    case 315:
      return sqrtFactory('√2').div(-2);

    case 240:
    case 300:
      return sqrtFactory('√3').div(-2);

    case 270:
      return -1;
  }
}

function specialValueCos(floatArg) {
  switch (floatArg) {
    case 0:
    case 360:
      return 1;

    case 30:
    case 150:
      return sqrtFactory('√3').div(2);

    case 45:
    case 315:
      return sqrtFactory('√2').div(2);

    case 60:
    case 300:
      return 0.5;

    case 90:
    case 270:
      return 0;

    case 120:
    case 330:
      return -0.5;

    case 135:
    case 225:
      return sqrtFactory('√2').div(-2);

    case 150:
    case 210:
      return sqrtFactory('√3').div(-2);

    case 180:
      return -1;
  }
}

function specialValueTan(floatArg) {
  switch (floatArg) {
    case 0:
    case 180:
    case 360:
      return 0;

    case 30:
    case 210:
      return sqrtFactory('√3').div(3);

    case 45:
    case 225:
      return 1;

    case 60:
    case 240:
      return sqrtFactory('√3');

    case 90:
    case 270:
      throw { name: 'Maths error' };

    case 120:
    case 300:
      return sqrtFactory('√3').timesMinusOne();

    case 135:
    case 315:
      return -1;

    case 150:
    case 330:
      return sqrtFactory('√3').div(-3);
  }
}

function standardTrigFunc(trigFunc, arg) {}
