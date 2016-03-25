// Usage in `npm run develop`: sessionStorage.debugScript = '../js/scripts/click-rectangle.js';
// Load in our dependencies
var simulant = require('simulant');

// Find the rectangle element in the palette
var rectEl = document.querySelector('[data-element=Rectangle]');
simulant.fire(rectEl, 'click');
