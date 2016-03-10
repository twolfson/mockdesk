// Load in our dependencies
var delegate = require('delegate');
var Rectangle = require('./elements/rectangle');

// Define our constants
var SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
var ELEMENT_PALETTE_ID = 'element-palette';
var WORKSPACE_ID = 'workspace';

// Define our constructor
function Application(container, config) {
  // Save config for later
  this.config = config;

  // Define layers
  // TODO: Move to an application state layer
  this.layers = [];

  // Create an element palette
  // TODO: Make this tabbed to switch to file tree
  // TODO: Move element palette to its own view
  var elementPaletteEl = document.createElement('div');
  elementPaletteEl.setAttribute('width', 100);
  elementPaletteEl.setAttribute('height', 400);
  elementPaletteEl.className = 'clearfix';
  elementPaletteEl.style.cssText = 'float: left; background: white';
  var elementPaletteRect = new Rectangle({
    width: 100,
    height: 100
  });
  elementPaletteEl.setAttribute('id', 'element-palette');
  elementPaletteEl.appendChild(elementPaletteRect.content);

  // Create a canvas to draw our elements on
  // TODO: Move to view layer
  // TODO: Build an underlay, canvas, and overlay "layers"
  var workspaceEl = document.createElementNS(SVG_NAMESPACE, 'svg');
  workspaceEl.setAttribute('width', 500);
  workspaceEl.setAttribute('height', 400);
  workspaceEl.setAttribute('viewBox', '0 0 500 400');
  workspaceEl.setAttribute('id', 'workspace');
  workspaceEl.style.cssText = 'background: linen;';

  // Replace the container content with our elements
  [].forEach.call(container.childNodes, function removeChildNode (childNode) {
    container.removeChild(childNode);
  });
  container.appendChild(elementPaletteEl);
  container.appendChild(workspaceEl);

  // Save our elements
  this.elementPaletteEl = elementPaletteEl;
  this.workspaceEl = workspaceEl;

  // Register our bindings
  this.registerBindings();
}
Application.prototype = {
  // TODO: Rename to appendChild?
  appendElement: function (el) {
    // Add element to our layers and return fluent
    this.layers.push(el);
    this.svgEl.appendChild(el.content);
    return this;
  },
  _getSvgElOffset: function () {
    // http://youmightnotneedjquery.com/#offset
    var boundingRect = this.svgEl.getBoundingClientRect();
    return {
      top: boundingRect.top + document.body.scrollTop,
      left: boundingRect.left + document.body.scrollLeft
    };
  },
  // When someone clicks on the SVG, add an element at that position
  // TODO: This logic is temporary (should be drag/drop from element palette)
  //   or maybe someone can click at a point and we spawna default element size
  // TODO: Figure out better place to put these bindings (e.g. method)
  // TODO: Add test for click handler
  // TODO: Add visual test integrations
  //   There is Chrome.captureDesktop but it's prob overkill and can't be reused elsewhere
  //   Prob best to stick with Gemini
  // TODO: Test and assert that we append element at offset position
  handleClick: function (evt) {
    // Create an element at our requested location
    // DEV: SVGs use x/y relative to their top/left, not the body's top/left
    //   as a result, we need to remove the x/y offset
    var svgElOffset = this._getSvgElOffset();
    var rect = new Rectangle({
      width: 100,
      height: 100,
      x: evt.clientX - svgElOffset.left,
      y: evt.clientY - svgElOffset.top
    });

    // Add our layer
    this.appendElement(rect);
  },
  registerBindings: function () {
    // Add mouse bindings
  }
};

// Export our function
module.exports = Application;
