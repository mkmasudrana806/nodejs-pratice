/*
 * Title: Handle Request and Response
 * Description: Handle request and response
 * Author: Masud Rana
 * Date: 24/10/2023
 */

// Dependencies
const url = require("url");
const { StringDecoder } = require("string_decoder");
const notFound = require("../controller/notFoundController");
const routes = require("../routes/routes");

// module scaffolding
const handler = {};

handler.handleReqRes = (req, res) => {
  // request handling
  const parseURL = url.parse(req.url, true);
  const path = parseURL.pathname;
  const trimedPath = path.replace(/^\/+|\/+$/g, "");
  const method = req.method.toLowerCase();
  const queryStringObject = parseURL.query;
  const headers = req.headers;
  const requestProperties = {
    parseURL,
    path,
    trimedPath,
    queryStringObject,
    headers,
    method,
  };

  //note: req body come as stream. so need to parse
  const decoder = new StringDecoder("utf-8");
  let realData = "";

  // this will select the controller and store chosenController variable
  // then call this controller with 'requestProperties' and callback function
  const chosenController = routes[trimedPath] ? routes[trimedPath] : notFound;
  chosenController(requestProperties, (statusCode, payload) => {
    statusCode = typeof statusCode === "number" ? statusCode : 500;
    payload = typeof payload === "object" ? payload : {};

    const payloadString = JSON.stringify(payload);

    // return the final response
    res.writeHead(statusCode);
    res.end(payloadString);
  });

  req.on("data", (buffer) => {
    realData += decoder.write(buffer);
  });

  req.on("end", () => {
    realData += decoder.end();
    // response handle
    console.log(realData);
    res.end("Hello World");
  });
};

module.exports = handler;
