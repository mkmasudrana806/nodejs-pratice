/*
 * Title: Server library
 * Description: Server related library
 * Author: Masud Rana
 */

// Dependencies
const http = require("http");
const { handleReqRes } = require("../helpers/handleReqRes");

// server object - module scaffolding
const server = {};

// configuration : config is now under environment variable
server.config = {
  port: 3000,
};

// create server
server.createServer = () => {
  const serverInstance = http.createServer(server.handleReqRes);
  serverInstance.listen(server.config.port, () => {
    console.log("Server listening on port " + server.config.port);
  });
};

// handle request and response
server.handleReqRes = handleReqRes;

// start the server
server.init = () => {
  server.createServer();
};

module.exports = server;