// Load in our dependencies
var Application = require('./application');

// Initialize and globally export our application
window.app = new Application(document.getElementById('main'));
