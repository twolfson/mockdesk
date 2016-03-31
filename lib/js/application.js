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
  var handlePointInset = 3;
  var handlePointStyle = 'width: 6px; height: 6px; background: #9999CC; border: 1px solid #000;';
  var handleEl = D.DIV({
    style: 'position: absolute; width: 30px; height: 30px; padding: ' + handlePointInset + 'px; z-index: 1000'
  }, [
    // Border
    D.DIV({
      style: 'width: 100%; height: 100%; border: 1px solid #000'
    }),
    // Top edge, top-right corner, right edge, bottom-right corner
    D.DIV({
      style: 'position: absolute; top: 1px; left: 50%; margin-left: -' + handlePointInset + 'px; ' + handlePointStyle
    }),
    D.DIV({
      style: 'position: absolute; top: 1px; right: 1px; margin-left: 0px; ' + handlePointStyle
    }),
    D.DIV({
      style: 'position: absolute; top: 50%; right: 1px; margin-top: -' + handlePointInset + 'px; ' + handlePointStyle
    }),
    D.DIV({
      style: 'position: absolute; bottom: 1px; right: 1px; margin-top: 0px; ' + handlePointStyle
    }),
    // Bottom edge, bottom-left corner, left edge, top-left corner
    D.DIV({
      style: 'position: absolute; bottom: 1px; right: 50%; margin-right: -' + handlePointInset + 'px; ' +
        handlePointStyle
    }),
    D.DIV({
      style: 'position: absolute; bottom: 1px; left: 1px; margin-right: 0px; ' + handlePointStyle
    }),
    D.DIV({
      style: 'position: absolute; bottom: 50%; left: 1px; margin-bottom: -' + handlePointInset + 'px; ' +
        handlePointStyle
    }),
    D.DIV({
      style: 'position: absolute; top: 1px; left: 1px; margin-bottom: 0px; ' + handlePointStyle
    })
  ]);
  workspaceEl.appendChild(handleEl);

  // TODO: Abstract me...
  // TODO: This should prob fire on `addWidget` as well
  // TODO: Test that clicking off of an element will not show handles
  // TODO: Test that clicking on an element will show handles
  //   Verify that the border of these handles are exactly the same as rect's
  // TODO: Test that clicking on then off an element will not show handles
  var that = this;
  workspaceEl.addEventListener('click', function handleClick (evt) {
    // Look at each of our layers from top-down (most visible to least visible)
    // DEV: We don't use `elementFromPoint` since wecould click on our handles
    // TODO: Make sure this is the ordering of most to least visible
    // TODO: Handle clicking on groups
    var i = 0;
    var len = that.layers.length;
    var matchingBounds;
    for (; i < len; i++) {
      // If the layer is in the element's bounds, then save it and stop
      var layer = that.layers[i];
      var layerBounds = layer.getBounds();
      if (layerBounds.left <= evt.pageX && layerBounds.right >= evt.pageX &&
          layerBounds.top <= evt.pageY && layerBounds.bottom >= evt.pageY) {
        matchingBounds = layerBounds;
      }
    }

    // If we had matching bounds, then move our handle element to that location
    // TODO: Should we have something like `selectedLayer`?
    if (matchingBounds) {
      var workspaceBounds = that.getWorkspaceBounds();
      var workspaceScrollInfo = that.getWorkspaceScrollInfo();
      // TODO: Make workspace bounds reusable
      handleEl.style.top =
        (matchingBounds.top - workspaceBounds.top + workspaceScrollInfo.top - handlePointInset) + 'px';
      handleEl.style.left =
        (matchingBounds.left - workspaceBounds.left + workspaceScrollInfo.left - handlePointInset) + 'px';
      handleEl.style.width = (matchingBounds.width + 2 * handlePointInset) + 'px';
      handleEl.style.height = (matchingBounds.height + 2 * handlePointInset) + 'px';
    }
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
  getWorkspaceBounds: function () {
    return this.workspaceEl.getBoundingClientRect();
  },
  getWorkspaceScrollInfo: function () {
    return {
      left: this.workspaceEl.scrollLeft,
      top: this.workspaceEl.scrollTop
    };
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
