/*
 * Title: worker library
 * Description: worker related library
 * Author: Masud Rana
 */

// Dependencies
const url = require("url");
const http = require("http");
const https = require("https");
const data = require("./data");
const { parseJSON } = require("../helpers/utilities");
const { sendTwilioSms } = require("../helpers/notifications");

// worker object - module scaffolding
const worker = {};

// *************** gather all the checks function implementations
worker.gatherAllChecks = () => {
  data.list("checks", (err, checks) => {
    if (!err && checks && checks.length > 0) {
      checks.forEach((check) => {
        // read the check data
        data.read("checks", check, (err2, checkData) => {
          if (!err2 && checkData) {
            worker.validateCheckData(parseJSON(checkData));
          } else {
            console.log("Error: reading one the checks data");
          }
        });
      });
    } else {
      console.log("Error: Couldn't find checks list");
    }
  });
};

// ************ validate individual check data
worker.validateCheckData = (checkData) => {
  if (checkData && checkData.id) {
    const checkDataOrginal = checkData;
    checkDataOrginal.state =
      typeof checkData.state === "string" &&
      ["up", "down"].includes(checkDataOrginal.state)
        ? checkData.state
        : "down";

    checkDataOrginal.lastChecked =
      typeof checkData.lastChecked === "number" && checkData.lastChecked > 0
        ? checkData.lastChecked
        : false;

    // pass to the next process for adding new object to check
    worker.performCheck(checkDataOrginal);
  } else {
    console.log(
      "Error: Couldn't find check data id(maybe check invalid formatted"
    );
  }
};

// ************* perfom check
worker.performCheck = (orginalCheckData) => {
  // use flag variable to ensure that check is done
  let checkOutcome = {
    error: false,
    value: false,
  };
  let outcomeSent = false;

  // parse the hostname from orginal data
  const parseUrl = url.parse(
    orginalCheckData.protocol + "://" + orginalCheckData.url,
    true
  );

  const hostname = parseUrl.hostname;
  const path = parseUrl.path;

  // construct the request object
  const requestDetails = {
    protocol: orginalCheckData.protocol + ":",
    hostname: hostname,
    method: orginalCheckData.method,
    path: path,
    timeout: orginalCheckData.timeoutSeconds * 10000,
  };

  // const options = {
  //   protocol: orginalCheckData.protocol,
  //   hostname: orginalCheckData.url,
  //   path: path,
  //   method: orginalCheckData.method,
  //   timeout: orginalCheckData.timeoutSeconds * 1000,
  // };

  //now decide which request module i will use.
  //i will use the userbased module which they set
  const protocolToUse = orginalCheckData.protocol === "http" ? http : https;

  let req = protocolToUse.request(requestDetails, (res) => {
    if (res) {
      console.log(res.statusCode);
      // grab the status of the response
      const status = res.statusCode;
      // update the checked outcome and pass the next process
      checkOutcome.responseCode = status;
      if (!outcomeSent) {
        worker.processCheckOutcome(orginalCheckData, checkOutcome);
        outcomeSent = true;
      }
    } else {
      console.log("Error while requesting http or https inside perfomCheck");
    }
  });

  // error event fired when error occurs
  req.on("error", (e) => {
    checkOutcome = {
      error: true,
      value: e,
    };
    // update the checked outcome and pass the next process
    if (!outcomeSent) {
      worker.processCheckOutcome(orginalCheckData, checkOutcome);
      outcomeSent = true;
    }

    console.log("Error while request the http or https");
  });

  // timeout event fired when timeout occurs
  req.on("timeout", (err) => {
    checkOutcome = {
      error: true,
      value: requestDetails.timeout,
    };
    // update the checked outcome and pass the next process
    if (!outcomeSent) {
      worker.processCheckOutcome(orginalCheckData, checkOutcome);
      outcomeSent = true;
    }
    console.log("Timeout while request the http or https");
  });

  // read the response after processing of buffer done
  req.on("end", () => {
    console.log("No more data in response received");
  });
};

// *********** process outcome
worker.processCheckOutcome = (orginalCheckData, checkOutcome) => {
  //check if check outcome
  let state =
    !checkOutcome.error &&
    checkOutcome.responseCode &&
    orginalCheckData.successCodes.indexOf(checkOutcome.responseCode) > -1
      ? "up"
      : "down";

  // decide whether we should alert the user or not
  let alertWanted =
    orginalCheckData.lastChecked && orginalCheckData.state !== state
      ? true
      : false;
  // update the check data
  let newCheckData = orginalCheckData;
  newCheckData.state = state;
  newCheckData.lastChecked = Date.now();

  // save to the database file system
  data.update("checks", newCheckData.id, newCheckData, (err3) => {
    if (!err3) {
      // send the check data to the next function for message notification
      if (alertWanted) {
        // send message notification
        worker.alertUserToStatusChange(newCheckData);
      } else {
        console.log("Alert is not needed as there no state change!");
      }
    } else {
      console.log("Error trying to save check data of one of the checks");
    }
  });
};

// alert user that check state is changed
worker.alertUserToStatusChange = (newCheckData) => {
  let messsage = `Alert: Your check for ${newCheckData.method.toUpperCase()} ${
    newCheckData.protocol
  }://${newCheckData.url} is currently ${newCheckData.state}`;

  // now send this message to the user
  sendTwilioSms(newCheckData.userPhone, messsage, (err) => {
    if (!err) {
      console.log(`User was alreted to s status change vis SMS: ${messsage}`);
    } else {
      console.log("There  was a problem sending sms to one of the user!");
    }
  });
};

// start the worker
worker.init = () => {
  // execute all the checks at initial time
  worker.gatherAllChecks();

  // execute after a period of time infinite
  setInterval(() => {
    worker.gatherAllChecks();
  }, 1000 * 10);
};

// export worker
module.exports = worker;
