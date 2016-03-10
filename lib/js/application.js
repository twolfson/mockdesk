// Load in our dependencies
var Rectangle = require('./elements/rectangle');

// Define our constants
var SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

// Define our constructor
function Application(container) {
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
  var elementPaletteSvgRectEl = document.createElementNS(SVG_NAMESPACE, 'svg');
  elementPaletteSvgRectEl.setAttribute('width', 102);
  elementPaletteSvgRectEl.setAttribute('height', 102);
  elementPaletteSvgRectEl.setAttribute('viewBox', '0 0 102 102');
  elementPaletteSvgRectEl.style.cssText = 'background: transparent; padding: 8px';
  elementPaletteEl.appendChild(elementPaletteSvgRectEl);
  var elementPaletteRect = new Rectangle({
    width: 100,
    height: 100,
    x: 1,
    y: 1
  });
  elementPaletteEl.setAttribute('id', 'element-palette');
  elementPaletteSvgRectEl.appendChild(elementPaletteRect.content);

  // Create a canvas to draw our elements on
  // TODO: Move to view layer
  // TODO: Build an underlay, canvas, and overlay "layers"
  var svgEl = document.createElementNS(SVG_NAMESPACE, 'svg');
  svgEl.setAttribute('width', 500);
  svgEl.setAttribute('height', 400);
  svgEl.setAttribute('viewBox', '0 0 500 400');
  svgEl.setAttribute('id', 'workspace');
  svgEl.style.cssText = 'background: linen;';

  // Set up mouse bindings
  // TODO: Figure out better place to put these bindings (e.g. method)
  svgEl.addEventListener('click', this.handleClick.bind(this));

  // Replace the container content with our elements
  [].forEach.call(container.childNodes, function removeChildNode (childNode) {
    container.removeChild(childNode);
  });
  container.appendChild(elementPaletteEl);
  container.appendChild(svgEl);

  // Save our svgEl for later
  this.svgEl = svgEl;

  // TODO: Prob accept container and draw onto it...
  //   but let's get an Electron app set up now...
  //   1. SVG on HTML
  //   2. Click on page to create new element
  //   3. Hot code integration so we don't constantly reboot/reload page
  //      Hot code swap is ideal but LiveReload is tolerable
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
  }
};

// Export our function
module.exports = Application;
