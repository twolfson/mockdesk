// Load in our dependencies
var ipcRenderer = require('electron').ipcRenderer;
// DEV: Path is relative to HTML page
var Application = require('../js/application');

// Define a container for application info
window.Mockdesk = {
  init: function () {
    // Create our app binding
    window.app = new Application(document.getElementById('main'));

    // Define a listener for LiveReload toggles
    ipcRenderer.on('toggle:livereload', this.toggleLiveReload);
  },
  toggleLiveReload: function () {
    // Based on https://github.com/livereload/livereload-extensions/blob/0a8edb9cc7008249c23718386e19d99230e81179/src/common/injected.coffee#L49-L91
    // If there is no LiveReload on the page (we are disabled), then inject our script tag
    var liveReloadEnabled = !!window.LiveReload;
    if (!liveReloadEnabled) {
      var scriptEl = document.createElement('script');
      scriptEl.src = 'http://localhost:35729/livereload.js';
      document.body.appendChild(scriptEl);
    // Otherwise (we are enabled), disable LiveReload
    // DEV: This deletes `window.LiveReload`
    //   https://github.com/livereload/livereload-js/blob/03b09762e930f6c6c67ee270c208d1c11de0247f/src/startup.coffee
    } else {
      window.LiveReload.shutDown();
    }

    // TODO: Send back a response notification so the menu can listen and update accordingly
    ipcRenderer.send('change:livereload', !liveReloadEnabled);
  }
};
