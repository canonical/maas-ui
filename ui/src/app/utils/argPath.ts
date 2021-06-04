type Args = {
  [x: string]: number | string;
};

/**
 * Creates a function to transform a react-router style URL into a full path.
 * @param path - A path in react-router format e.g. /machine/:id
 * @returns A function to generate the full url.
 */
export const argPath =
  <A extends Args>(path: string) =>
  (args: A | null, unmodified = false): string => {
    if (unmodified || !args) {
      return path;
    }
    return Object.entries(args).reduce((exactPath, [param, value]) => {
      return exactPath.replace(`:${param}`, value.toString());
    }, path);
  };
