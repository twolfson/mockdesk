// Load in our dependencies
var assert = require('assert');

// Define our helpers
exports.saveEl = function (selector, options) {
  // Fallback and resolve our options
  options = options || {};
  var key = options.key || 'el';

  before(function saveElFn () {
    // Verify we have a container for developer sanity
    assert(this.container, 'No container was found. Please verify `appUtils.init` was run');

    // Find our element
    var el = this.container.querySelector(selector);
    assert(el, 'No element with selector "' + selector + '" was found in the container. ' +
      'Please verify the selector is correct');

    // Save our element and its bounds
    // this.el, this.elBounds; this.svgEl, this.svgElBounds
    this[key] = el;
    this[key + 'Bounds'] = el.getBoundingClientRect();
  });
  after(function cleanup () {
    delete this[key];
    delete this[key + 'Bounds'];
  });
};
