// Load in our dependencies
var assert = require('assert');

// Define our constants
// TODO: Load constant from common location
var SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

// Define our element
// TODO: Inherit from base element
function Rectangle(params) {
  // Verify we received parameters
  assert.notEqual(params.width, undefined, 'Rectangle expected `params.width` but did not receive it');
  assert.notEqual(params.height, undefined, 'Rectangle expected `params.height` but did not receive it');

  // Extract our stroke width
  var strokeWidth = params.strokeWidth || 1;

  // Create an SVG container for our element
  // DEV: We use border box sizing for the SVG container
  //   but all widths/heights will be in reference to the element itself
  //   which ignores its strokes
  var svgEl = document.createElementNS(SVG_NAMESPACE, 'svg');
  var borderBoxWidth = params.width + strokeWidth * 2;
  var borderBoxHeight = params.height + strokeWidth * 2;
  svgEl.setAttribute('width', borderBoxWidth);
  svgEl.setAttribute('height', borderBoxHeight);
  svgEl.setAttribute('viewBox', '0 0 ' + borderBoxWidth + ' ' + borderBoxHeight);

  // Create our element with offsets for stroke width
  var rectEl = document.createElementNS(SVG_NAMESPACE, 'rect');
  rectEl.setAttribute('width', params.width);
  rectEl.setAttribute('height', params.height);
  rectEl.setAttribute('x', strokeWidth);
  rectEl.setAttribute('y', strokeWidth);
  // TODO: Allow for customization of fill and stroke
  rectEl.setAttribute('fill', '#ffffff');
  rectEl.setAttribute('stroke', '#000000');
  rectEl.setAttribute('stroke-width', strokeWidth);

  // Insert our element into its SVG container and save it for later
  svgEl.appendChild(rectEl);
  this.content = svgEl;

  // If there is a style, then style our element
  if (params.style) {
    this.setStyle(params.style);
  }
}
Rectangle.prototype = {
  setStyle: function (params) {
    // For each of the style properties
    var key;
    for (key in params) {
      if (params.hasOwnProperty(key)) {
        this.content.style[key] = params[key];
      }
    }
  }
};
module.exports = Rectangle;
