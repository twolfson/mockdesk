// Load in our dependencies
// DEV: Path is relative to HTML page
var Application = require('../js/application');

// Define a function to initialize our application
window.Mockdesk = {
  init: function () {
    // Initialize and globally export our application
    window.app = new Application(document.getElementById('main'));
  }
};
