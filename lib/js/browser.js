// Load in our dependencies
// var ipcRenderer = require('electron').ipcRenderer;
// DEV: Path is relative to HTML page
var Application = require('../js/application');
var logger = require('../js/logger');

// Define a container for application info
window.Mockdesk = {
  init: function () {
    // TODO: Retrieve our current config via `sendSync`
    // Create our app binding
    var config = {liveReload: true};
    window.app = new Application(document.getElementById('main'), config);

    // If we should enable LiveReload, then enable it
    if (config.liveReload) {
      this.enableLiveReload();
    }
  },
  enableLiveReload: function () {
    // Add the LiveReload script tag to the page
    var scriptEl = document.createElement('script');
    scriptEl.src = 'http://localhost:35729/livereload.js';
    document.body.appendChild(scriptEl);

    // Log the LiveReload toggle
    logger.info('LiveReload enabled');
  }
};
