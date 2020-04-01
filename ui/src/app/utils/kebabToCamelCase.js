/**
 * Convert a kebab case string into a camel case string,
 * e.g. my-string => myString
 *
 * @param {string} string - the kebab case string to convert
 * @returns {string} camel case string
 */
export const kebabToCamelCase = str =>
  str.replace(/-([a-z])/g, g => g[1].toUpperCase());
