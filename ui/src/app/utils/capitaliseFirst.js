/**
 * Capitalises the first character of a string.
 * @param {String} text
 */
export const capitaliseFirst = ([firstLetter, ...rest]) =>
  [firstLetter.toLocaleUpperCase(), ...rest].join("");
