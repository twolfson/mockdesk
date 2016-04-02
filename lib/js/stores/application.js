// Load in our dependencies
var assert = require('assert');
var Immutable = require('immutable');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var _ = require('underscore');

// Define our store
function ApplicationStore() {
  // Inherit from EventEmitter
  EventEmitter.call(this);

  // Create a store for layers
  this._layers = new Immutable.Map();
}
util.inherits(ApplicationStore, EventEmitter);
_.extend(ApplicationStore.prototype, {
  addWidget: function (widgetName, options) {
    // TODO: Handle location via options?
  }
});

// Initialize and export our store
var appStore = new ApplicationStore();
module.exports = appStore;
