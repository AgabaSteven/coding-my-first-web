import { Vector3Input, Vector3Tuple } from '../types';

export const normalizeVector3 = (input: Vector3Input): Vector3Tuple => {
  if (Array.isArray(input)) {
    return input;
  }
  return [input.x, input.y, input.z];
};
