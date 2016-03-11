// Load in our non-application dependencies
var ipcRenderer = require('electron').ipcRenderer;

// Retrieve our current config via `sendSync`
var config = JSON.parse(ipcRenderer.sendSync('get-config-sync'));
// If we should enable LiveReload, then add it to the page
if (config.livereload) {
  var scriptEl = document.createElement('script');
  scriptEl.src = 'http://localhost:35729/livereload.js';
  document.body.appendChild(scriptEl);
  console.info('LiveReload enabled');
}

// Load our application dependencies
// DEV: Path is relative to HTML page
var Application = require('../js/application');
var logger = require('../js/logger');

// Define a container for application info
window.Mockdesk = {
  init: function () {
    logger.info('Starting application with config:', JSON.stringify(config));

    // Create our app binding
    window.app = new Application(document.getElementById('main'), config);
    logger.info('Application started');
  }
};
