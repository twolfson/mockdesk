// Load in our dependencies
var assert = require('assert');
var fs = require('fs');
var path = require('path');
var remote = require('electron').remote;
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var Application = require('../../lib/js/application');

// Define constants
// `/test/test-files/expected-screenshots`
var EXPECTED_VISUAL_BASE_DIR = __dirname + '/../visual-tests/expected-screenshots';
var ACTUAL_VISUAL_BASE_DIR = __dirname + '/../visual-tests/actual-screenshots';

// Resolve our preferred visual base dir
var TARGET_VISUAL_BASE_DIR = null;
if (process.env.VISUAL_TESTS === 'COMPARE') {
  TARGET_VISUAL_BASE_DIR = ACTUAL_VISUAL_BASE_DIR;
} else if (process.env.VISUAL_TESTS === 'CAPTURE') {
  TARGET_VISUAL_BASE_DIR = EXPECTED_VISUAL_BASE_DIR;
} else if (process.env.VISUAL_TESTS !== undefined) {
  throw new Error('Expected environment variable `VISUAL_TESTS` to be "CAPTURE" or "COMPARE" ' +
    'but it was "' + process.env.VISUAL_TESTS + '"');
}

// Clean out and recreate our base directory for screenshots
if (TARGET_VISUAL_BASE_DIR) {
  before(function removeTargetVisualBaseDir (done) {
    rimraf(TARGET_VISUAL_BASE_DIR, done);
  });
  before(function createTargetVisualBaseDir (done) {
    mkdirp(TARGET_VISUAL_BASE_DIR, done);
  });
}

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
    this.app.destroy();
    delete this.app;

    // Clean up our DOM connections
    document.body.removeChild(this.container);
    delete this.container;
  });
};

exports.capturePage = function (_filepath, params) {
  // Verify we received the filepath
  assert(_filepath, '`apputils.capturePage` requires `filepath` but none was received');

  // If we aren't doing visual tests, then return early
  if (!TARGET_VISUAL_BASE_DIR) {
    return;
  }

  // Define our call to capture the page
  var filepath = path.join(TARGET_VISUAL_BASE_DIR, _filepath);
  before(function callCapturePage (done) {
    // Wait for 2 animations for DOM to update
    // DEV: We aren't sure how buggy this is yet, we tried forcing a DOM redraw via `offsetHeight`
    //   but the issue might be a lag between Electron and capturePage
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
