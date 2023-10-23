/*
 * Title: Basic Node app example
 * Description: Simple node application that print random  quotes per second interval
 * Author: Masud Rana
 * Date: 23/10/2023
 */

// Dependencies [own module, external module, node module]
const mathLibrary = require("./lib/math");
const quotesLibrary = require("./lib/quotes");

// App object - Module scaffolding
const app = {};

// Configuration
app.config = {
  timeBetweenQuotes: 1000,
};

// Function that prints a random quote
app.printAQuote = function printQuote() {
  // get all the quotes
  const allQuotes = quotesLibrary.allQuotes();

  // get the length of all the quotes
  const numberOfQuotes = allQuotes.length;

  // pick a random number between 0 and numberOfQuotes
  const randomNumber = mathLibrary.getRandomNumber(1, numberOfQuotes);

  // get the at that position in the array (minus one)
  const selectQuote = allQuotes[randomNumber - 1];

  // print the quote to the console
  console.log(selectQuote);
};

// function that loops indefinitely, calling the printAQuote function as it goes
app.indefiniteLoop = function indefiniteLoop() {
  setInterval(app.printAQuote, app.config.timeBetweenQuotes);
};

// Invoke the loop
app.indefiniteLoop();
