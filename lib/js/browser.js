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
    // TODO: Send back a response notification so the menu can listen and update accordingly
    window.__liveReloadEnabled = false;
    ipcRenderer.on('toggle:livereload', this.toggleLiveReload);
  },
  toggleLiveReload: function () {
    function next() {
      // If we were enabled, then disable LiveReload
      // https://github.com/livereload/livereload-extensions/blob/0a8edb9cc7008249c23718386e19d99230e81179/src/common/injected.coffee#L49-L91
      if (window.__liveReloadEnabled) {
        window.LiveReload.shutDown();
      // Otherwise, enable
      } else {

      }

      window.__liveReloadEnabled = !window.__liveReloadEnabled;
      ipcRenderer.send('change:livereload', window.__liveReloadEnabled);
    }

    // If there is no LiveReload on the page, then inject our script tag
    if (!window.LiveReload) {
      var scriptEl = document.createElement('script');
      scriptEl.src = 'http://localhost:35729/livereload.js';
      document.body.appendChild(scriptEl);
      scriptEl.onload = next;
    // Otherwise, toggle now
    } else {
      next();
    }
  }
};
