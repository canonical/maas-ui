type StringToKebabCase<S extends string> =
  S extends `${infer FirstPart} ${infer Rest}`
    ? `${Lowercase<FirstPart>}-${StringToKebabCase<Rest>}`
    : S extends `${infer FirstPart}${infer CapChar}${infer Rest}`
    ? CapChar extends Uncapitalize<CapChar>
      ? `${FirstPart}${CapChar}${StringToKebabCase<Rest>}`
      : `${FirstPart}-${Lowercase<CapChar>}${StringToKebabCase<Rest>}`
    : Lowercase<S>;

/**
 * Convert a string to kebab case,
 * e.g. My string => my_string
 *
 * @param {string} string - the string to convert
 * @returns {string} kebab case string
 */
export function toKebabCase<S extends string>(str: S): StringToKebabCase<S> {
  return str
    .trim()
    .replace(/-+/g, "_")
    .split(/\s+/)
    .map((word) => word.toLowerCase())
    .join("_") as StringToKebabCase<S>;
}
