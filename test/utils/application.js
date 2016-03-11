// Load in our dependencies
var assert = require('assert');
var Application = require('../../lib/js/application');

// Define a helper to create our app
exports.init = function () {
  before(function createApplication () {
    assert.strictEqual(this.app, undefined, 'Ran `appUtils.init` while another `init` was in progress. ' +
      'Please only run 1 `appUtils.init` at a time');
    this.container = document.createElement('div');
    document.body.appendChild(this.container);
    this.app = new Application(this.container);
  });
  after(function cleanup () {
    document.body.removeChild(this.container);
    delete this.container;
    // TODO: Define a teardown method for `this.app` so it can cleanup bindings
    delete this.app;
  });
};
