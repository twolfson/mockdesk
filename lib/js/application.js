// Load in our dependencies
var assert = require('assert');
var classnames = require('classnames');
var Draggabilly = require('draggabilly');
var delegate = require('delegate');
var D = require('./domo');
var Rectangle = require('./widgets/rectangle');

// Define our constants
var WIDGET_PALETTE_ID = 'widget-palette';
var WIDGET_CLASSNAME = 'widget';
var WORKSPACE_ID = 'workspace';

// Define a map for all our widgets
var widgetMap = {};
widgetMap[Rectangle.name] = Rectangle;

// Define our constructor
function Application(container, config) {
  // Save config for later
  var that = this;
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
      // Create our return content (except for the widget)
      var appendTargetEl;
      var retVal = D.DIV({
        style: 'padding: 4px 8px 8px'
      }, [
        appendTargetEl = D.DIV({
          class: classnames(WIDGET_CLASSNAME),
          dataWidget: widgetName // data-widget
        }, [
          D.B({style: 'line-height: 1.5;'}, widgetName),
          D.DIV({
            style: [
              'position: absolute;',
              'width: 100px;',
              'height: 100px;',
              'border: 2px dashed #CCC;',
              'color: #CCC;',
              'font-size: 0.9em;',
              'border-radius: 8px;',
              'padding-top: 36px;',
              'text-align: center;'
            ].join('')
          }, 'Rectangle')
        ])
      ]);

      // Create a function for creating and appending new widgets
      function createNewWidget() {
        // Create our new widget
        var WidgetClass = widgetMap[widgetName];
        var widget = new WidgetClass({
          width: 100,
          height: 100
        });

        // Attach draggabilly binding
        var draggie = new Draggabilly(widget.content, {
          // TODO: Contain to widget palette and workspace (don't want drags to tools)
          containment: document.body
        });
        // TODO: Move to custom reusable function
        draggie.pointerDown = function (event, pointer) {
          // Find the HTML element's current page position
          // DEV: Draggabilly cleverly manages current pointer position on HTML element
          //   by using `translate` transformations
          // bounds = {top, right, bottom, left, height, width}
          // http://youmightnotneedjquery.com/#offset
          var bounds = this.element.getBoundingClientRect();
          var topOffset = bounds.top + document.body.scrollTop;
          var leftOffset = bounds.left + document.body.scrollLeft;

          // Relocate our HTML element to the body
          document.body.appendChild(this.element);
          this.element.style.position = 'absolute';
          this.element.style.left = leftOffset + 'px';
          this.element.style.top = topOffset + 'px';

          // Call the initial method
          return Draggabilly.prototype.pointerDown.call(this, event, pointer);
        };

        // If someone clicks instead of drags, then call our click handler
        draggie.on('staticClick', function handleStaticClick (evt, pointer) {
          that._handleWidgetClick(widgetName);
        });

        // When the drag finishes
        draggie.on('dragEnd', function handleDragEnd (evt, pointer) {
          // TODO: Determine where the element is positioned
          //   Should this be based on cursor position (e.g. intent) or object coverage (e.g. absolutes)?
          //   I think a little of both; use mouse as gravity and if 70% of object away from mouse is on target,
          //     then assume not intended
          //   Prob write a logger for us to see what feels good
          // workspaceBounds = {top, right, bottom, left, height, width}
          var workspaceBounds = workspaceEl.getBoundingClientRect();

          // TODO: If we are in the workspace
          if (true) {
            // Collect info before disabling draggie
            var widgetBounds = widget.content.getBoundingClientRect();

            // Disable dragging (for now)
            // DEV: We have different drag interactions from widget palette than from workspace
            draggie.destroy();

            // Move the widget in the workspace
            widget.setStyle({
              left: widgetBounds.left - workspaceBounds.left,
              position: 'absolute',
              top: widgetBounds.top - workspaceBounds.top
            });
            that.appendWidget(widget);

            // and repopulate the widget palette
            createNewWidget();
          // TODO: Otherwise, return the widget to its original position
          // TODO: Or maybe we reap it and create a new widget?
          } else {
            // TODO: Remove placeholder
          }

          // TODO: Add tests for dragging into workspace
          // TODO: Add tests for dragging into back to palette
          // TODO: Instead of creating an widget back in the palette,
          //   let's move the widget back to the palette and create a local clone
          //   Otherwise, we will have to disable draggie on the widget and prob some more stuff
          // TODO: Add tests for dragging the existing widget (shouldn't do anything yet)
          // TODO: How do we handle incomplete drags? Based on pointer location or majority of widget?
        });

        // Attach our widget to its insertion point
        appendTargetEl.appendChild(widget.content);
      }

      // Create a new widget
      createNewWidget();

      // Return our retVal
      return retVal;
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
    // Add widget to our layers and return a fluent interface
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
  // TODO: Tolerate bad drops (e.g. dropping back on widget palette)
  // TODO: Drop leaving our window context and then coming back with mouse up
  // TODO: Once we add back drag/drop support, add test for scroll positions
  //   They are encountered when we add an widget out of bounds, scroll to it, and add another widget
  // DEV: We need a separate handler since `draggabilly` can prevent propagation of a static click
  _handleWidgetClick: function (widgetName) {
    // Resolve our widget's matching constructor
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
  handleWidgetClick: function (evt) {
    // Resolve our widget and pass it onto a lower click handler
    var targetEl = evt.delegateTarget;
    var widgetName = targetEl.dataset.widget; // data-widget
    return this._handleWidgetClick(widgetName);
  },
  registerBindings: function () {
    // Add mouse bindings
    delegate(document.body, '.' + WIDGET_CLASSNAME, 'click', this.handleWidgetClick.bind(this));
  }
};

// Export our function
module.exports = Application;
