// Load in our dependencies
var assert = require('assert');
var classnames = require('classnames');
var Draggabilly = require('draggabilly');
var delegate = require('delegate');
var D = require('./domo');
var Rectangle = require('./elements/rectangle');

// Define our constants
var ELEMENT_PALETTE_ID = 'element-palette';
var ELEMENT_CLASSNAME = 'element';
var WORKSPACE_ID = 'workspace';

// Define a map for all our elements
var elementMap = {};
elementMap[Rectangle.name] = Rectangle;

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
  var elementPaletteEl = D.DIV({
    id: ELEMENT_PALETTE_ID,
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
    }, 'Elements')
  ].concat((function createElements () {
    return Object.keys(elementMap).map(function createElement (elementName) {
      // Create our return content (except for the element)
      var elementAppendEl;
      var retVal = D.DIV({
        style: 'padding: 4px 8px 8px'
      }, [
        elementAppendEl = D.DIV({
          class: classnames(ELEMENT_CLASSNAME),
          dataElement: elementName
        }, [
          D.B({style: 'line-height: 1.5;'}, elementName),
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

      // Create a function for creating and appending new elements
      function createNewEl() {
        // Create our new element
        var ElementClass = elementMap[elementName];
        var element = new ElementClass({
          width: 100,
          height: 100
        });

        // Attach draggabilly binding
        var draggie = new Draggabilly(element.content, {
          // TODO: Contain to element palette and workspace (don't want drags to tools)
          containment: document.body
        });
        // TODO: Move to custom reusable function
        draggie.pointerDown = function (event, pointer) {
          // Find the element's current page position
          // DEV: Draggabilly cleverly manages current pointer position on element
          //   by using `translate` transformations
          // bounds = {top, right, bottom, left, height, width}
          // http://youmightnotneedjquery.com/#offset
          var bounds = this.element.getBoundingClientRect();
          var topOffset = bounds.top + document.body.scrollTop;
          var leftOffset = bounds.left + document.body.scrollLeft;

          // Relocate our element to the body
          document.body.appendChild(this.element);
          this.element.style.position = 'absolute';
          this.element.style.left = leftOffset + 'px';
          this.element.style.top = topOffset + 'px';

          // Call the initial method
          return Draggabilly.prototype.pointerDown.call(this, event, pointer);
        };
        draggie.on('dragStart', function handleDragStart (evt, pointer) {
          console.log('dragStart');
        });
        draggie.on('dragMove', function handleDragMove (evt, pointer) {
          console.log('dragMove');
        });
        draggie.on('dragEnd', function handleDragEnd (evt, pointer) {
          // TODO: Determine where the element is positioned
          // workspaceBounds = {top, right, bottom, left, height, width}
          // var workspaceBounds = workspaceEl.getBoundingClientRect();
          console.log('dragEnd');

          // Disable dragging (for now)
          // DEV: We have different drag interactions from element palette than from workspace
          draggie.disable();

          // TODO: If we are in the workspace
            // Move the element in the workspace
            // and repopulate the element palette
            createNewEl();
          // TODO: Otherwise, return the element to its original position
          // TODO: Or maybe we reap it and create a new element?

          // TODO: Add tests for dragging into workspace
          // TODO: Add tests for dragging into back to palette
          // TODO: Instead of creating an element back in the palette, let's move the element back to the palette and create a local clone
          //   Otherwise, we will have to disable draggie on the element and prob some more stuff
          // TODO: Add tests for dragging the existing element (shouldn't do anything yet)
          // TODO: How do we handle incomplete drags? Based on pointer location or majority of element?

        });

        // Attach our element to its insertion point
        elementAppendEl.appendChild(element.content);
      }

      // Create a new element
      createNewEl();

      // Return our retVal
      return retVal;
    });
  }())));

  // Create a canvas to draw our elements on
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

  // Replace the container content with our elements
  [].forEach.call(container.childNodes, function removeChildNode (childNode) {
    container.removeChild(childNode);
  });
  container.appendChild(elementPaletteEl);
  container.appendChild(workspaceEl);

  // Save our elements
  this.container = container;
  this.elementPaletteEl = elementPaletteEl;
  this.workspaceEl = workspaceEl;

  // Register our bindings
  this.registerBindings();
}
Application.prototype = {
  appendElement: function (el) {
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

    // Empty our layers and custom elements
    this.layers = [];
    this.container.removeChild(this.elementPaletteEl);
    this.container.removeChild(this.workspaceEl);

    // Reset attributes to minimize chance of a leak
    delete this.container;
    delete this.elementPaletteEl;
    delete this.workspaceEl;
  },
  // TODO: Add support for drag/drop from palette to workspace
  //   Be sure to use a gesture system (e.g. `dragstart`, `dragend`) and not roll our own `mousedown`/`mouseup` junk
  //   It will be extremely frustrating otherwise...
  //   We need to tolerate bad drops (e.g. dropping back on element palette)
  //   Drop leaving our window context and then coming back with mouse up
  // TODO: Add visual test integrations
  //   There is Chrome.captureDesktop but it's prob overkill and can't be reused elsewhere
  //   Prob best to stick with Gemini
  //   Actually, we should be able to use `browserWindow.capturePage`
  // TODO: Once we add back drag/drop support, add test for scroll positions
  //   They are encountered when we add an element out of bounds, scroll to it, and add another element
  handleElementClick: function (evt) {
    // Resolve our element and its matching class
    var targetEl = evt.delegateTarget;
    var elementName = targetEl.dataset.element;
    var ElementClass = elementMap[elementName];
    assert(ElementClass, 'Expected `elementMap` to have property "' + elementName + '" but it didn\'t');

    // Add an element to our workspace
    // TODO: If an element already exists in that position, then shift it 10 pixels down/right
    var element = new ElementClass({
      width: 100,
      height: 100,
      style: {
        left: 100,
        position: 'absolute',
        top: 100
      }
    });

    // Add our layer
    this.appendElement(element);
  },
  registerBindings: function () {
    // Add mouse bindings
    delegate(document.body, '.' + ELEMENT_CLASSNAME, 'click', this.handleElementClick.bind(this));
  }
};

// Export our function
module.exports = Application;
