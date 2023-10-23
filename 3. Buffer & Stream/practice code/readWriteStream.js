/*
const fs = require("fs");

//createReadStream create stream and fire events when one buffer is completed to show the client. so need to work into event to receive the buffer
// we can pass 'utf-8' encoding to createReadStream
const ourReadStream = fs.createReadStream(`${__dirname}/big data.txt`, "utf-8");
const ourWriteStream = fs.createWriteStream(`${__dirname}/output.txt`, "utf-8");

// or we can use toString() method with chunk
ourReadStream.on("data", (chunk) => {
  // when we get a new buffer of chunk then we write it to our writeStream by 'write' method
  ourWriteStream.write(chunk);
});


*/
// read and write stream using pipeline
const fs = require("fs");

const ourReadStream = fs.createReadStream(`${__dirname}/big data.txt`, "utf-8");
const ourWriteStream = fs.createWriteStream(`${__dirname}/output.txt`, "utf-8");

ourReadStream.pipe(ourWriteStream);

// this line means. pipe er mukhe write stream ase. so pipe die joto buffer asbe. seta ourWriteStream a dhukbe one by one buffer.
// here no need to listen events.
