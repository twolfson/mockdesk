// Load in our dependencies
var assert = require('assert');
var classnames = require('classnames');
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
      var ElementClass = elementMap[elementName];
      return D.DIV({
        style: 'padding: 4px 8px 8px'
      }, [
        D.DIV({
          class: classnames(ELEMENT_CLASSNAME),
          dataElement: elementName
        }, [
          D.B({style: 'line-height: 1.5;'}, elementName),
          (new ElementClass({
            width: 100,
            height: 100
          }).content)
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
    this.workspaceEl.appendChild(el.content);
    return this;
  },
  _getWorkspaceElOffset: function () {
    // http://youmightnotneedjquery.com/#offset
    var boundingRect = this.workspaceEl.getBoundingClientRect();
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
  // TODO: Add test for scroll positions
  //   They are encountered when we add an element out of bounds, scroll to it, and add another element
  handleWorkspaceClick: function (evt) {
    // Create an element at our requested location
    // DEV: SVGs use x/y relative to their top/left, not the body's top/left
    //   as a result, we need to remove the x/y offset
    var workspaceEl = this.workspaceEl;
    var workspaceElOffset = this._getWorkspaceElOffset();
    var rect = new Rectangle({
      width: 100,
      height: 100,
      style: {
        left: evt.clientX - workspaceElOffset.left + workspaceEl.scrollLeft,
        position: 'absolute',
        top: evt.clientY - workspaceElOffset.top + workspaceEl.scrollTop
      }
    });

    // Add our layer
    this.appendElement(rect);
  },
  handleElementClick: function (evt) {
    // Resolve our element and its matching class
    var el = evt.delegateTarget;
    var elementName = el.dataset.element;
    var ElementClass = elementMap[elementName];
    assert(ElementClass, 'Expected `elementMap` to have property "' + elementName + '" but it didn\'t');

    // Add an element to our workspace
    // TODO: If an element already exists in that position, then shift it 10 pixels down/right
  },
  registerBindings: function () {
    // Add mouse bindings
    delegate(document.body, '.' + ELEMENT_CLASSNAME, 'click', this.handleElementClick.bind(this));
  }
};

// Export our function
module.exports = Application;
