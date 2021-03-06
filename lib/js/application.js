// Load in our dependencies
var WidgetPalette = require('./views/widget-palette');
var D = require('./domo');

// Define our constants
var WORKSPACE_ID = 'workspace';

// Define our constructor
function Application(container, config) {
  // Save config for later
  this.config = config;

  // Define layers
  // TODO: Move to an application state layer
  this.layers = [];

  // Create our views
  var widgetPalette = new WidgetPalette(this);

  // Create a canvas to draw our widgets on
  // TODO: Move to view layer
  // TODO: Build an underlay, canvas, and overlay "layers"
  var workspaceEl = D.DIV({
    id: WORKSPACE_ID,
    style: [
      'background: linen;',
      'width: 500px;',
      'height: 400px;',
      'overflow: scroll;',
      'position: relative;'
    ].join('')
  });

  // Replace the container content with our widgets
  [].forEach.call(container.childNodes, function removeChildNode (childNode) {
    container.removeChild(childNode);
  });
  widgetPalette.bind(container);
  container.appendChild(workspaceEl);

  // Save our elements
  this.container = container;
  this.widgetPalette = widgetPalette;
  this.workspaceEl = workspaceEl;
}
Application.prototype = {
  appendWidget: function (el) {
    // Add widget to our layers and return a fluent interface
    this.layers.push(el);
    this.workspaceEl.appendChild(el.content);
    return this;
  },
  destroy: function () {
    // Empty our layers and custom widgets
    this.layers = [];
    this.widgetPalette.destroy();
    this.container.removeChild(this.workspaceEl);

    // Reset attributes to minimize chance of a leak
    delete this.container;
    delete this.widgetPalette;
    delete this.workspaceEl;
  }
};

// Export our function
module.exports = Application;
