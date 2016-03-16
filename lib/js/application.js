// Load in our dependencies
var assert = require('assert');
var classnames = require('classnames');
var Unidragger = require('unidragger');
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
      // Create our new element
      // TODO: Create 2 elements at same position where 1 is absolute positioned
      //   Then, on dragend we can create another absolute positioned one
      //   OR maybe during drag we have a dehyrdated state (e.g. gray dashed bordered box)
      var ElementClass = elementMap[elementName];
      var element = new ElementClass({
        width: 100,
        height: 100
      });

      // Attach draggabilly binding
      var unidragger = new Unidragger();
      unidragger.handles = [element.content];
      unidragger.bindHandles();
      unidragger.dragStart = function handleDragStart (evt, pointer) {
        // // Move element from our container to the body
        // document.body.appendChild(element.content);

        // Correct our element's position
        console.log('dragStart');
        // draggie._getPosition();
        // draggie.measureContainment();
        // draggie.setLeftTop();
        // this.pointerDownPoint.x = pointer.pageX;
        // this.pointerDownPoint.y = pointer.pageY;
        // draggie.startPosition.x = draggie.position.x;
        // draggie.startPosition.y = draggie.position.y;
        // draggie.dragPoint.x = 0;
        // draggie.dragPoint.y = 0;
      };
      unidragger.dragMove = function handleDragMove (evt, pointer, moveVector) {
        console.log('dragMove');
        var dragX = this.dragStartPoint.x + moveVector.x;
        var dragY = this.dragStartPoint.y + moveVector.y;
        element.setStyle({
          position: 'absolute',
          top: dragY + 'px',
          left: dragX + 'px'
        });
      };
      unidragger.dragEnd = function handleDragEnd (evt, pointer) {
        console.log('dragEnd');
      };

      // Define and return wrapping HTML
      return D.DIV({
        style: 'padding: 4px 8px 8px'
      }, [
        D.DIV({
          class: classnames(ELEMENT_CLASSNAME),
          dataElement: elementName
        }, [
          D.B({style: 'line-height: 1.5;'}, elementName),
          element.content
        ])
      ]);
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
