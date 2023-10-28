/*
 * Title: Project entry file
 * Description: Project entry file to start the node server
 * Author: Masud Rana
 */

// Dependencies
const server = require("./lib/server");
const worker = require("./lib/worker");

// app object - module scaffolding
const app = {};

app.init = () => {
  // start the node server
  server.init();
  // start the worker
  worker.init();
};

app.init();

module.exports = app;
