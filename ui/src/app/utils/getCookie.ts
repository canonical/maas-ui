/**
 * Get cookie value by name.
 *
 * @param {string} n - cookie name.
 * @returns {string} - cookie value.
 */
export const getCookie = (n: string): string | undefined => {
  const cookie = `; ${document.cookie}`.match(`;\\s*${n}=([^;]+)`);
  return cookie ? cookie[1] : undefined;
};
