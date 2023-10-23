const fs = require("fs");

//createReadStream create stream and fire events when one buffer is completed to show the client. so need to work into event to receive the buffer
// we can pass 'utf-8' encoding to createReadStream
const ourReadStream = fs.createReadStream(`${__dirname}/big data.txt`, "utf-8");

// or we can use toString() method with chunk
ourReadStream.on("data", (chunk) => {
  console.log(chunk);
});
