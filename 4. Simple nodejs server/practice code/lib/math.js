/*
 * Title: Math Library
 * Description: Utility library for math-related functions
 * Author: Masud Rana
 * Date: 23/10/2023
 */

// Math object - Module scaffolding
const math = {};

// Get a random integer between two integers

math.getRandomNumber = function getRandomNumber(min, max) {
  let minimum = min;
  let maximum = max;
  minimum = typeof minimum === "number" ? minimum : 0;
  maximum = typeof maximum === "number" ? maximum : 0;

  return Math.floor(Math.random() * (maximum - minimum) + min);
};

module.exports = math;
