/*
 * Title: Environments
 * Description: Handle all environment related things
 * Author: Masud Rana
 * Date: 24/10/2023
 */

// Dependencies

// module scaffolding
const environments = {};

environments.staging = {
  port: 3000,
  envName: "staging",
  secretKey: "sdlkfdsjf",
  maxChecks: 5,
};

environments.production = {
  port: 5000,
  envName: "production",
  secretKey: "klhsd",
  maxChecks: 5,
};

// determine which environment was passed
const currentEnvironment = typeof (process.env.NODE_ENV === "string")
  ? process.env.NODE_ENV
  : "staging";

// export conrespoinding environment object
const environmentToExport =
  typeof environments[currentEnvironment] === "object"
    ? environments[currentEnvironment]
    : environments.staging;

// export module
module.exports = environmentToExport;
