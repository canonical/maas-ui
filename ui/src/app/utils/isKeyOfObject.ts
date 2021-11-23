/**
 * Narrow a string to whether it is a valid key for an object or not.
 */
export const isKeyOfObject = <P extends string, T extends Record<P, T[P]>>(
  prop: P,
  object: T
): object is T & Record<P, string> => {
  return prop && object && prop in object;
};
