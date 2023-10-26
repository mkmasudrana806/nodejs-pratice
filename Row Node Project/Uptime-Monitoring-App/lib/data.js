/*
 * Title: File System
 * Description: Make library for file system for CRUD operations
 * Author: Masud Rana
 * Date: 25/10/2023
 */

// Dependencies
const fs = require("fs");
const path = require("path");

// library - module scaffolding
const lib = {};

// base directory of the data folder
// lib.basedir = path.join(__dirname, "../data/");
lib.basedir = path.join(__dirname, "../.data/");
//lib.basedir = C:\Users\User\OneDrive\Desktop\Nodejs\Row Node Project\Uptime-Monitoring-App\data\

// write data to file
lib.create = (folderName, fileName, data, callback) => {
  // open file for writing
  fs.open(
    `${lib.basedir + folderName + "/" + fileName}.json`,
    "wx",
    function (err1, fileDescriptor) {
      if (!err1 && fileDescriptor) {
        // convert data to stringify json object
        const stringData = JSON.stringify(data);

        // write data to file
        fs.writeFile(fileDescriptor, stringData, function (err2) {
          if (!err2) {
            fs.close(fileDescriptor, function (err3) {
              if (!err3) callback(false);
              else callback("Error closing the new file");
            });
          } else {
            callback("Error writing newfile");
          }
        });
      } else {
        callback("File already exits");
      }
    }
  );
};

// read data from file
lib.read = (folderName, fileName, callback) => {
  fs.readFile(
    `${lib.basedir + folderName + "/" + fileName}.json`,
    "utf-8",
    (err, data) => {
      callback(err, data);
    }
  );
};

// update data to existing file = read + update
lib.update = (folderName, fileName, data, callback) => {
  // file open for writting
  fs.open(
    `${lib.basedir + folderName + "/" + fileName}.json`,
    "r+",
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        // convert the data to string
        const stringData = JSON.stringify(data);

        // truncate the file ( remove existing data)
        fs.ftruncate(fileDescriptor, (err1) => {
          if (!err1) {
            // write to the file and close it
            fs.writeFile(fileDescriptor, stringData, (err2) => {
              if (!err2) {
                fs.close(fileDescriptor, (err3) => {
                  if (!err3) {
                    callback(false);
                  } else {
                    callback("Error closing file descriptor");
                  }
                });
              } else {
                callback("Error write to file");
              }
            });
          } else {
            callback("Error truncating file");
          }
        });
      } else {
        callback("Error updating. File may not exits");
      }
    }
  );
};

// delete file
lib.delete = (folderName, fileName, callback) => {
  // unlink the file
  fs.unlink(`${lib.basedir + folderName + "/" + fileName}.json`, (err) => {
    if (!err) {
      callback(false);
    } else {
      callback("Error to delete file!");
    }
  });
};

// export the lib
module.exports = lib;
