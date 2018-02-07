import { buttonReturn } from './ButtonUtilities';
import { calcEval } from '../CalcEval';

export function pressEquals(input, output) {
  return buttonReturn(input, calcEval(input, output), -1);
}
