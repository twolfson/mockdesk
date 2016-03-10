// Load in our dependencies
var ipcRenderer = require('electron').ipcRenderer;
// DEV: Path is relative to HTML page
var Application = require('../js/application');
var logger = require('../js/logger');

// Define a container for application info
window.Mockdesk = {
  init: function () {
    // Retrieve our current config via `sendSync`
    var config = JSON.parse(ipcRenderer.sendSync('get-config-sync'));
    logger.info('Starting application with config:', JSON.stringify(config));

    // Create our app binding
    window.app = new Application(document.getElementById('main'), config);
    logger.info('Application started');

    // If we should enable LiveReload, then enable it
    if (config.livereload) {
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
