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
  assert.notEqual(params.x, undefined, 'Rectangle expected `params.x` but did not receive it');
  assert.notEqual(params.y, undefined, 'Rectangle expected `params.y` but did not receive it');

  // TODO: It feels weird to tell item its x/y...
  var rectEl = document.createElementNS(SVG_NAMESPACE, 'rect');
  rectEl.setAttribute('width', params.width);
  rectEl.setAttribute('height', params.height);
  rectEl.setAttribute('x', params.x);
  rectEl.setAttribute('y', params.y);
  // TODO: Allow for customization of fill
  rectEl.setAttribute('fill', '#008d46');
  this.content = rectEl;
}
module.exports = Rectangle;
