// Load in our dependencies
var assert = require('assert');
var delegate = require('delegate');
var classnames = require('classnames');
var Draggabilly = require('draggabilly');
var D = require('../domo');
var Rectangle = require('../widgets/rectangle');

// Define our constants
var WIDGET_PALETTE_ID = 'widget-palette';
var WIDGET_CLASSNAME = 'widget';

// Define a map for all our widgets
var widgetMap = {};
widgetMap[Rectangle.name] = Rectangle;

// Define our constructor
function WidgetPalette(app) {
  // Save app for later
  // TODO: Remove reference on `destroy`
  this.app = app;

  // Create a widget palette
  // TODO: Make this tabbed to switch to file tree
  // TODO: Add teardown content?
  // DEV: This is currently being built in a Backbone-esque manner
  this.el = D.DIV({
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
      // Create our new widget
      var WidgetClass = widgetMap[widgetName];
      var widget = new WidgetClass({
        width: 100,
        height: 100
      });

      // Retnrn our HTML wrapper
      return D.DIV({
        style: 'padding: 4px 8px 8px'
      }, [
        D.DIV({
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
          }, 'Rectangle'),
          widget.content
        ])
      ]);
    });
  }())));
}
WidgetPalette.prototype = {
  // TODO: Tolerate bad drops (e.g. dropping back on widget palette)
  // TODO: Drop leaving our window context and then coming back with mouse up

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
    this.app.appendWidget(widget);
  },
  handleWidgetClick: function (evt) {
    // Resolve our widget and pass it onto a lower click handler
    var targetEl = evt.delegateTarget;
    var widgetName = targetEl.dataset.widget; // data-widget
    return this._handleWidgetClick(widgetName);
  },
  bind: function (container) {
    // Assert we don't have unbind functions
    assert.strictEqual(this.unbindFns, undefined, '`widgetPalette` cannot run `bind` twice. Please run `unbind` first');
    var that = this;
    this.unbindFns = [];

    // Append ourselves to the container
    container.appendChild(this.el);
    this.unbindFns.push(function removeChild () {
      container.removeChild(that.el);
    });

    // Add mouse bindings
    var delegation = delegate(container, '.' + WIDGET_CLASSNAME, 'click', this.handleWidgetClick.bind(this));
    this.unbindFns.push(function undelegate () {
      delegation.destroy();
    });

    // Add drag bindings
    var widgetContainers = this.el.querySelectorAll('.' + WIDGET_CLASSNAME);
    [].forEach.call(widgetContainers, function bindDrag (widgetContainer) {
      // Attach draggabilly binding
      var widgetName = widgetContainer.dataset.widget; // data-widget
      var widgetEl = widgetContainer.querySelector('svg');
      var WidgetClass = widgetMap[widgetName];
      var draggie = new Draggabilly(widgetEl, {
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
        // Determine where the element is positioned
        // workspaceBounds = {top, right, bottom, left, height, width}
        var workspaceBounds = that.app.workspaceEl.getBoundingClientRect();

        // TODO: If we are over the workspace, then create a new element at that location
        //   Should this be based on cursor position (e.g. intent) or object coverage (e.g. absolutes)?
        //   I think a little of both; use mouse as gravity and if 70% of object away from mouse is on target,
        //     then assume not intended
        //   Prob write a logger for us to see what feels good
        if (true) {
          // Collect info before disabling draggie
          var widgetBounds = widgetEl.getBoundingClientRect();

          // Create an identical widget but placed in the workspace
          // TODO: Maybe define a `clone` method on widgets?
          // DEV: A cleaner way to handle `appendWidget` might be via a global moderator (a la Flux)
          var newWidget = new WidgetClass({
            width: 100,
            height: 100,
            style: {
              left: widgetBounds.left - workspaceBounds.left + that.app.workspaceEl.scrollLeft,
              position: 'absolute',
              top: widgetBounds.top - workspaceBounds.top + that.app.workspaceEl.scrollTop
            }
          });

          // Insert our new widget into the workspace
          that.app.appendWidget(newWidget);
        }

        // Reset the original widget to its original position
        this.element.style.position = 'relative';
        this.element.style.left = null;
        this.element.style.top = null;
        widgetContainer.appendChild(this.element);

        // TODO: Add tests for dragging into back to palette
        // TODO: Add tests for dragging the widget in the workspace (shouldn't do anything yet)
        // TODO: How do we handle incomplete drags? Based on pointer location or majority of widget?
      });

      // Save function to unbind ourself
      that.unbindFns.push(function unbindDraggie () {
        draggie.destroy();
      });
    });
  },
  unbind: function () {
    // Verify we have a unbind functions to run
    assert.notEqual(this.unbindFns, undefined, '`widgetPalette` has no unbind functions set ' +
      '(i.e. `bind` was never run)');

    // Iterate and run each of our unbind functions
    this.unbindFns.forEach(function runUnbindFn (unbindFn) {
      unbindFn();
    });
  }
};

// Export our constructor
module.exports = WidgetPalette;
