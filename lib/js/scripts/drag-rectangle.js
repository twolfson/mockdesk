// Usage in `npm run develop`: sessionStorage.debugScript = '../js/scripts/drag-rectangle.js';
// Load in our dependencies
var simulant = require('simulant');
var TWEEN = require('tween.js');

// Find our rectangle to drag/drop
var svgEl = document.querySelector('[data-widget=Rectangle] > svg');

// Define our parameters
var startCoords = {x: 100, y: 100};
var endCoords = {x: 400, y: 200};
var dragPeriod = 1000;

// Immediately click our rectangle
// https://github.com/metafizzy/unipointer/blob/v2.1.0/unipointer.js#L94-L101
// TODO: Get accurate starting points
simulant.fire(svgEl, 'mousedown', {button: 0, clientX: startCoords.x, clientY: startCoords.y});

// Over the course of the next 2 seconds, drag it across to the workspace
// https://github.com/metafizzy/unipointer/blob/v2.1.0/unipointer.js#L173-L175
var tween = new TWEEN.Tween(startCoords)
  .to(endCoords, dragPeriod)
  .easing(TWEEN.Easing.Exponential.Out)
  .onUpdate(function handleUpdate () {
    simulant.fire(svgEl, 'mousemove', {clientX: this.x, clientY: this.y});
  });

// When our drag completes, release our mouse
tween.onComplete(function handleComplete () {
  simulant.fire(svgEl, 'mouseup', {clientX: this.x, clientY: this.y});
});

// Set up our animation bindings
tween.start();
function animate(time) {
  // Run our update
  var havePendingAnimations = TWEEN.update(time);

  // If we are still tweening, then continue
  if (havePendingAnimations) {
    requestAnimationFrame(animate);
  }
}
requestAnimationFrame(animate);
