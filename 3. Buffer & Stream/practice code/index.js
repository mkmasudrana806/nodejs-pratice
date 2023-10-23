const http = require("http");

const server = http.createServer(function (req, res) {
  if (req.url === "/") {
    res.write("<html><head><title>Form</title></head>");
    res.write(
      '<body> <form method="post" action="/process"> <input name="message" /></form> </ body>'
    );
    res.end();
  } else if (req.url === "/process" && req.method === "POST") {
    //in req object we can't get data like req.data. because in streaming way we know that data is come as buffer.after creating one buffer it fire the data event. so we need to use req.on("data", function) like this. because client data is come to the server as streaming way.

    // first we store all the buffered data to the body array
    const body = [];
    req.on("data", function (chunk) {
      body.push(chunk);
    });

    // after end of the streaming the 'end' event will fire
    // now we can work with the data as full data file
    req.on("end", function () {
      console.log("Streaming finished");
      const parsebody = Buffer.concat(body).toString();
      console.log(parsebody);
    });

    res.write("Thank you for submitting");
    res.end();
  } else {
    res.write("Not found!");
    res.end();
  }
});

server.listen(5000, () => {
  console.log("Server is listening on port: 5000");
});
