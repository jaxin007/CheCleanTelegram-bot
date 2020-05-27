/**
 * Safe get value by function and try catch block
 *
 * @param { function } func
 * @param { any } defaultValue
 *
 * @returns
 * @memberOf object || defaultValue
 */
function getSafe(func, defaultValue) {
  try {
    return func();
  } catch (error) {
    return defaultValue;
  }
}

module.exports = {
  getSafe,
};
