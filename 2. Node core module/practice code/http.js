const http = require("http");

// here server is event emiter
const server = http.createServer((req, res) => {
  if (req.url === "/") res.writeHead("this is main port");
  if (req.url === "/about") res.write("this is about page");
});

//when a new connection is established means server is hitting
// then this "connection" event will be   fired
server.on("connection", () => {
  console.log("a new connection established");
});

// Note: rather doing connection events. we can pass a callback function to the createServer for each connection request for    each connection request. it will be fired when a new connection is established

// here is ther server register listener
server.listen(4000, () => {
  console.log("server listening on port ", 4000);
});
