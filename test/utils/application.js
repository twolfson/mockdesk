// Load in our dependencies
var assert = require('assert');
var fs = require('fs');
var path = require('path');
var remote = require('electron').remote;
var Application = require('../../lib/js/application');

// Define constants
// `/test/test-files/expected-screenshots`
var EXPECTED_VISUAL_BASE_DIR = __dirname + '/../visual-tests/expected-screenshots';

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
    // Teardown our application bindings from the DOM
    // TODO: Add back destroy call
    // this.app.destroy();
    delete this.app;

    // Clean up our DOM connections
    document.body.removeChild(this.container);
    delete this.container;
  });
};

exports.capturePage = function (_filepath, params) {
  // Verify we received the filepath
  assert(_filepath, '`apputils.capturePage` requires `filepath` but none was received');
  // TODO: Alter file path based on `VISUAL_RECORD_MODE`
  //   (e.g. in CAPTURE_ONLY, we don't assert and we save to EXPECTED_VISUAL_BASE_DIR)
  //   or maybe we define a function to copy ACTUAL_VISUAL_BASE_DIR to EXPECTED_VISUAL_BASE_DIR?
  var filepath = path.join(EXPECTED_VISUAL_BASE_DIR, _filepath);

  // Define our handlers
  before(function callCapturePage (done) {
    // Wait for 2 animations for DOM to update
    requestAnimationFrame(function handleRequestAnimationFrame () {
      requestAnimationFrame(function handleRequestAnimationFrame () {
        // Capture our image
        function handleCapturePage(img) {
          // Save the image to disk
          fs.writeFile(filepath, img.toPng(), done);
        }
        if (params) {
          remote.getCurrentWindow().capturePage(params, handleCapturePage);
        } else {
          remote.getCurrentWindow().capturePage(handleCapturePage);
        }
      });
    });
  });
};
