import { calcEval } from './CalcEval';

it('adds integers', () => {
  expect(calcEval(['13', '+', '1'])).toEqual('14');
});

it('subtracts integers', () => {
  expect(calcEval(['13', '–', '1'])).toEqual('12');
});

it('multiplies integers', () => {
  expect(calcEval(['2', '×', '3'])).toEqual('6');
});

it('divides integers', () => {
  expect(calcEval(['6', '÷', '3'])).toEqual('2');
});

it('adds fractions', () => {
  expect(calcEval(['1/2', '+', '7/3'])).toEqual('17/6');
});

it('subtracts fractions', () => {
  expect(calcEval(['1/2', '–', '7/3'])).toEqual('-11/6');
});

it('multiplies fractions', () => {
  expect(calcEval(['2/3', '×', '9/4'])).toEqual('3/2');
});

it('divides fractions', () => {
  expect(calcEval(['6/5', '÷', '11/10'])).toEqual('12/11');
});

it('adds decimals', () => {
  expect(calcEval(['1.2', '+', '3.6'])).toEqual('4.8');
});

it('subtracts decimals', () => {
  expect(calcEval(['1.2', '–', '7.3'])).toEqual('-6.1');
});

it('multiplies decimals', () => {
  expect(calcEval(['1.2345', '×', '9.4185'])).toEqual('11.62713825');
});

it('divides fractions', () => {
  expect(calcEval(['6.5436', '÷', '11.1928'])).toEqual('16359/27982');
});
