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
  after(function cleanup (done) {
    // On the next animation frame (should be after everything else completes)
    var that = this;
      // Teardown our application bindings from the DOM
      console.log('destroy');
      that.app.destroy();
      delete that.app;

      // Clean up our DOM connections
      document.body.removeChild(that.container);
      delete that.container;

      // Callback
      done();
    }, 200);
  });
};
