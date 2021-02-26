/*
Logger class for easy and aesthetically pleasing console logging 
*/
const chalk = require("chalk");
const moment = require("moment");

exports.log = (content, type = "log") => {
  const timestamp = `[${moment().format("YYYY-MM-DD HH:mm:ss")}]:`;
  switch (type) {
    case "log": {
      return console.log(`${timestamp} ${chalk.cyanBright(`[${type.toUpperCase()}]`)} ${content} `);
    }
    case "warn": {
      return console.log(`${timestamp} ${chalk.yellowBright(`[${type.toUpperCase()}]`)} ${content} `);
    }
    case "error": {
      return console.log(`${timestamp} ${chalk.redBright(`[${type.toUpperCase()}]`)} ${content} `);
    }
    case "debug": {
      return console.log(`${timestamp} ${chalk.magentaBright(`[${type.toUpperCase()}]`)} ${content} `);
    }
    case "cmd": {
      return console.log(`${timestamp} ${chalk.whiteBright(`[${type.toUpperCase()}]`)} ${content}`);
    }
    case "ready": {
      return console.log(`${timestamp} ${chalk.greenBright (`[${type.toUpperCase()}]`)} ${content}`);
    }
    default: throw new TypeError("Logger type must be either warn, debug, log, ready, cmd or error.");
  }
}; 

exports.error = (...args) => this.log(...args, "error");

exports.warn = (...args) => this.log(...args, "warn");

exports.debug = (...args) => this.log(...args, "debug");

exports.cmd = (...args) => this.log(...args, "cmd");
