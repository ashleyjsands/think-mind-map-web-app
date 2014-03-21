/**
 * @fileoverview Provides in built functions.
 *
 */

/**
 * Asserts a boolean expression is true.
 * 
 * @param {boolean} bool a boolean expression.
 */
assert = function(bool) {
  if (!bool) {
    throw "Assertion failed.";
  }
}