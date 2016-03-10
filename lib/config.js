// Load in our dependencies
var ipcMain = require('electron').ipcMain;
var _ = require('underscore');

// Define config constructor
// DEV: If we need to support saving config to disk, use the setup from `google-music-electron`
//   https://github.com/twolfson/google-music-electron/blob/2.9.0/lib/config.js
function Config(cliOverrides) {
  // Save CLI overrides for later
  this.cliOverrides = cliOverrides;

  // Generate IPC bindings for config
  var that = this;
  ipcMain.on('get-config-sync', function handleGetConfigSync (evt) {
    evt.returnValue = JSON.stringify(that.getAll());
  });
}
Config.prototype = {
  getAll: function () {
    return _.defaults({}, this.cliOverrides);
  }
};

// Export our constructor
module.exports = Config;
