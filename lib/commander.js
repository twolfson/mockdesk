// Load in our dependencies
var util = require('util');
var Command = require('commander').Command;

// Define our camelcase helper
// https://github.com/tj/commander.js/blob/v2.9.0/index.js#L1046-L1050
function camelcase(flag) {
  return flag.split('-').reduce(function (str, word) {
    return str + word[0].toUpperCase() + word.slice(1);
  });
}

// Extend Commander to meet our needs
function ConfigCommand(name) {
  // Call the default Command constructor
  Command.call(this, name);

  // Define config options
  this.configOptions = [];
}
util.inherits(ConfigCommand, Command);

// Define a method to save a configurable option
ConfigCommand.prototype.configOption = function (flags, description, fn, defaultValue) {
  // Create our option as per normal
  var retVal = Command.prototype.option.apply(this, arguments);

  // Extract the new option and save it as a config option
  // https://github.com/tj/commander.js/blob/v2.9.0/index.js#L388-L389
  var option = this.options[this.options.length - 1];
  this.configOptions.push(option);

  // Return our return value
  return retVal;
};

// Define a method to retrieve configurable options
ConfigCommand.prototype.getConfig = function () {
  // Walk over our configuration options
  var config = {};
  var that = this;
  this.configOptions.forEach(function handleConfigOption (option) {
    // Extract the parsed value under its camelcased name
    // https://github.com/tj/commander.js/blob/v2.9.0/index.js#L362-L363
    var oname = option.name();
    var name = camelcase(oname);
    config[name] = that[name];
  });

  // Return our config
  return config;
};

// Export a new commander
// https://github.com/tj/commander.js/blob/v2.9.0/index.js#L17
module.exports = new ConfigCommand();
