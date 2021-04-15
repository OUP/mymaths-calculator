import insertAllImplicitAdditions from './insertAllImplicitAdditions';
import insertAllImplicitMultiplications from './insertAllImplicitMultiplications';
import handleNegativesWithSymbols from './handleNegativesWithSymbols';

export default function insertImplicitOps(inputArray) {
  inputArray = insertAllImplicitAdditions(inputArray);
  inputArray = insertAllImplicitMultiplications(inputArray);
  inputArray = handleNegativesWithSymbols(inputArray);
  return inputArray;
}
