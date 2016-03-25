// Load in our dependencies
var simulant = require('simulant');

// Find the rectangle's HTML element in the palette
var rectEl = document.querySelector('[data-widget=Rectangle]');
simulant.fire(rectEl, 'click');
