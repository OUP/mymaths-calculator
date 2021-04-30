import insertAllImplicitAdditions from './insertAllImplicitAdditions';
import insertAllImplicitMultiplications from './insertAllImplicitMultiplications';
import handleUnaryNegatives from './handleNegativesWithSymbols';

export default function insertImplicitOps(inputArray) {
  inputArray = insertAllImplicitAdditions(inputArray);
  inputArray = insertAllImplicitMultiplications(inputArray);
  inputArray = handleUnaryNegatives(inputArray);
  return inputArray;
}
