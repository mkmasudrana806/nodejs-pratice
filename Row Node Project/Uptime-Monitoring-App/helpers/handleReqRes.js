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
const { parseJSON } = require("./utilities");

// module scaffolding
const handler = {};

handler.handleReqRes = (req, res) => {
  // request handling
  const parseURL = url.parse(req.url, true);
  const path = parseURL.pathname;
  const trimedPath = path.replace(/^\/+|\/+$/g, "");
  const method = req.method.toLowerCase();
  const query = parseURL.query;
  const headers = req.headers;
  const requestProperties = {
    parseURL,
    path,
    trimedPath,
    query,
    headers,
    method,
  };

  //note: req body come as stream. so need to parse
  const decoder = new StringDecoder("utf-8");
  let realData = "";

  // this will select the controller and store chosenController variable
  // then call this controller with 'requestProperties' and callback function
  const chosenController = routes[trimedPath] ? routes[trimedPath] : notFound;

  // read stream data and store realData variable
  req.on("data", (buffer) => {
    realData += decoder.write(buffer);
  });

  // end data at last this event will be fired
  req.on("end", () => {
    realData += decoder.end();
    //include requestProperties to realData
    requestProperties.body = parseJSON(realData);
    // response handle
    chosenController(requestProperties, (statusCode, payload) => {
      statusCode = typeof statusCode === "number" ? statusCode : 500;
      payload = typeof payload === "object" ? payload : {};
      const payloadString = JSON.stringify(payload);

      // return the final response
      res.setHeader("content-type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);
    });
  });
};

module.exports = handler;
