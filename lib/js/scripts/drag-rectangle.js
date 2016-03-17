// Load in our dependencies
var simulant = require('simulant');

// Find the rectangle element in the palette
var rectEl = document.querySelector('[data-element=Rectangle] > svg');
// https://github.com/metafizzy/unipointer/blob/v2.1.0/unipointer.js#L94-L101
simulant.fire(rectEl, 'mousedown', {button: 0, clientX: 100, clientY: 100});
// https://github.com/metafizzy/unipointer/blob/v2.1.0/unipointer.js#L173-L175
simulant.fire(rectEl, 'mousemove', {clientX: 200, clientY: 200});
simulant.fire(rectEl, 'mouseup', {clientX: 200, clientY: 200});
