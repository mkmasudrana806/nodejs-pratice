/*
*********** PATH MODULE ****************
const path = require("path");
const myPath =
  "C:/Users/User/OneDrive/Desktop/Nodejs/2. Node core module/practice code/index.js";
//path.basename(myPath); expect a path and return recent file base name
console.log(path.basename(myPath));
console.log(path.dirname(myPath));
console.log(path.extname(myPath));
console.log(path.parse(myPath));


*********** OS MODULE ****************
const os = require("os");
console.log(os.platform());
//win32

console.log(os.homedir());
//C:\Users\User

console.log(os.freemem());
// 2646953984

// it gives the cpu information with core
console.log(os.cpus());

*********** file MODULE ****************

const fs = require("fs");

//if we use writeFileSync, it write always as new. it doesn't append to existing files.
// if we want to add new text to the file then we need to use appendFileSync method
fs.writeFileSync("myFile.txt", "Hello file system how are you");

fs.appendFileSync("myFile.txt", " this is new text");

// by default readFileSync give binary file binary buffer
// need to convert to get orginal text using toString method
const data = fs.readFileSync("myFile.txt");
console.log(data.toString());

fs.readFile("myFile.txt", (err, data) => {
  console.log(data.toString());
});

console.log("this line must print first then asynchronous file read");

*/

const EventEmitter = require("events");
//here EventEmitter is a class
// we need to create EventEmitter instance variable

const emitter = new EventEmitter();

// register a listener for 'bellring' event
emitter.on("bellring", (event) => {
  console.log("we need to run!, because ourr", event, "is oever");
});

// raise an event
emitter.emit("bellring", "First period");

const School = require("./other");
const school = new School();

school.on("bellRing", ({ period, text }) => {
  console.log(`we need to run becasue ${period} ${text}`);
});

school.startPeriod();
