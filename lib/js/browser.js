// Load in our non-application dependencies
var ipcRenderer = require('electron').ipcRenderer;
// DEV: Path is relative to HTML page
var logger = require('../js/logger');

// Retrieve our current config via `sendSync`
var config = JSON.parse(ipcRenderer.sendSync('get-config-sync'));
// If we should enable LiveReload, then add it to the page
if (config.livereload) {
  var scriptEl = document.createElement('script');
  scriptEl.src = 'http://localhost:35729/livereload.js';
  document.body.appendChild(scriptEl);
  logger.info('LiveReload enabled');
}

// Load our application dependencies
// DEV: Path is relative to HTML page
var Application = require('../js/application');

// Define a container for application info
window.Mockdesk = {
  init: function () {
    // Log our starting info
    logger.info('Starting application with config:', JSON.stringify(config));

    // Create our app binding
    window.app = new Application(document.getElementById('main'), config);
    logger.info('Application started');

    // If there's a setting in sessionStorage to load a script, then load it
    // DEV: We use sessionStorage to prevent trolling ourselves on open/close
    // Example usage: `sessionStorage.debugScript = '../js/scripts/click-rectangle.js';
    //   Then reload the page and this will `click-rectangle` will automatically run
    if (sessionStorage.debugScript) {
      logger.info('Debug script detected, loading it:', sessionStorage.debugScript);
      void require(sessionStorage.debugScript);
    }
  }
};
