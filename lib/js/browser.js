// Load in our dependencies
// DEV: Path is relative to HTML page
var Application = require('../js/application');

// Define a container for application info
window.Mockdesk = {
  init: function () {
    window.app = new Application(document.getElementById('main'));
  }
};
