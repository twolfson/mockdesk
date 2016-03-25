// Load in our dependencies
var assert = require('assert');
var classnames = require('classnames');
var delegate = require('delegate');
var D = require('./domo');
var Rectangle = require('./widgets/rectangle');

// Define our constants
// TODO: Rename these...
var WIDGET_PALETTE_ID = 'element-palette';
var WIDGET_CLASSNAME = 'element';
var WORKSPACE_ID = 'workspace';

// Define a map for all our widgets
var widgetMap = {};
widgetMap[Rectangle.name] = Rectangle;

// Define our constructor
function Application(container, config) {
  // Save config for later
  this.config = config;

  // Define layers
  // TODO: Move to an application state layer
  this.layers = [];

  // Create a widget palette
  // TODO: Make this tabbed to switch to file tree
  // TODO: Move widget palette to its own view
  var widgetPaletteEl = D.DIV({
    id: WIDGET_PALETTE_ID,
    // TODO: Prob relocate styles into CSS
    style: [
      'float: left;',
      'background: white;',
      'width: 120px;',
      'height: 400px;'
    ].join('')
  }, [
    // TODO: Work on line height and baseline...
    D.H3({
      style: 'padding: 0 8px; margin: 4px 0 0;'
    }, 'Widgets')
  ].concat((function createWidgets () {
    return Object.keys(widgetMap).map(function createWidget (widgetName) {
      var WidgetClass = widgetMap[widgetName];
      return D.DIV({
        style: 'padding: 4px 8px 8px'
      }, [
        D.DIV({
          class: classnames(WIDGET_CLASSNAME),
          dataWidget: widgetName
        }, [
          D.B({style: 'line-height: 1.5;'}, widgetName),
          (new WidgetClass({
            width: 100,
            height: 100
          }).content)
        ])
      ]);
    });
  }())));

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
  container.appendChild(widgetPaletteEl);
  container.appendChild(workspaceEl);

  // Save our widgets
  this.container = container;
  this.widgetPaletteEl = widgetPaletteEl;
  this.workspaceEl = workspaceEl;

  // Register our bindings
  this.registerBindings();
}
Application.prototype = {
  appendWidget: function (el) {
    // Add element to our layers and return a fluent interface
    this.layers.push(el);
    this.workspaceEl.appendChild(el.content);
    return this;
  },
  // TODO: Add test for destroy so we verify no leaks are created (maybe do as part of `appUtils.init`
  destroy: function () {
    // Remove our existing listeners
    // TODO: Update unbinding helpers
    // this.workspaceEl.removeEventListener('click', this._handleClick);

    // Empty our layers and custom widgets
    this.layers = [];
    this.container.removeChild(this.widgetPaletteEl);
    this.container.removeChild(this.workspaceEl);

    // Reset attributes to minimize chance of a leak
    delete this.container;
    delete this.widgetPaletteEl;
    delete this.workspaceEl;
  },
  // TODO: Add support for drag/drop from palette to workspace
  // TODO: Add visual test integrations
  //   There is Chrome.captureDesktop but it's prob overkill and can't be reused elsewhere
  //   Prob best to stick with Gemini
  //   Actually, we should be able to use `browserWindow.capturePage`
  // TODO: Once we add back drag/drop support, add test for scroll positions
  //   They are encountered when we add an element out of bounds, scroll to it, and add another element
  handleWidgetClick: function (evt) {
    // Resolve our widget and its matching constructor
    var targetEl = evt.delegateTarget;
    var widgetName = targetEl.dataset.widget;
    var WidgetClass = widgetMap[widgetName];
    assert(WidgetClass, 'Expected `widgetMap` to have property "' + widgetName + '" but it didn\'t');

    // Add an widget to our workspace
    // TODO: If an widget already exists in that position, then shift it 10 pixels down/right
    var widget = new WidgetClass({
      width: 100,
      height: 100,
      style: {
        left: 100,
        position: 'absolute',
        top: 100
      }
    });

    // Add our layer
    this.appendWidget(widget);
  },
  registerBindings: function () {
    // Add mouse bindings
    delegate(document.body, '.' + WIDGET_CLASSNAME, 'click', this.handleWidgetClick.bind(this));
  }
};

// Export our function
module.exports = Application;
