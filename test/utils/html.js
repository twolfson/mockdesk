// Load in our dependencies
var assert = require('assert');
var simulant = require('simulant');

// Define our helpers
// DEV: Thoughts on click/drag helpers
//   I feel like drag needs some work since people might want multiple steps
/*
before(function clickRectangleWidget () {
  var svgStartBounds = this.svgElBounds;
  appUtils.click(this.svgEl, {x: 100, y: 200, offsetByBounds: svgStartBounds});
});
before(function clickRectangleWidget () {
  var svgStartBounds = this.svgElBounds;
  appUtils.staticClick(this.svgEl, {x: 100, y: 200, offsetByBounds: svgStartBounds});
});
*/
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

exports.dragEl = function (el, options, done) {
  // Verify we received our parameters
  assert(options.start, '`htmlUtils.dragEl` expected `options.start` but it wasn\'t defined');
  assert(options.start.x !== undefined && options.start.y !== undefined,
    '`htmlUtils.dragEl` expected `options.start.{x,y}` but one wasn\'t defined');
  assert(options.end, '`htmlUtils.dragEl` expected `options.end` but it wasn\'t defined');
  assert(options.end.x !== undefined && options.end.y !== undefined,
    '`htmlUtils.dragEl` expected `options.end.{x,y}` but one wasn\'t defined');

  // Start dragging our HTML element
  simulant.fire(el, 'mousedown', {button: 0, clientX: options.start.x, clientY: options.start.y});

  // Then drag and release our HTML element
  setTimeout(function dragMoveEl () {
    simulant.fire(el, 'mousemove', {clientX: options.end.x, clientY: options.end.y});
  }, 10);
  setTimeout(function dragEndEl () {
    simulant.fire(el, 'mouseup', {clientX: options.end.x, clientY: options.end.y});
    done();
  }, 20);
};
