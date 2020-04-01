/**
 * Get cookie value by name.
 *
 * @param {string} n - cookie name.
 */
export const getCookie = (n) => {
  const cookie = `; ${document.cookie}`.match(`;\\s*${n}=([^;]+)`);
  return cookie ? cookie[1] : undefined;
};

export default getCookie;
