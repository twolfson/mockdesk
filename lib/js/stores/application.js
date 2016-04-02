// Load in our dependencies
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var _ = require('underscore');

// Define our store
function ApplicationStore() {
  // Inherit from EventEmitter
  EventEmitter.call(this);
}
util.inherits(ApplicationStore, EventEmitter);
_.extend(ApplicationStore.prototype, {
});

// Initialize and export our store
var appStore = new ApplicationStore();
module.exports = appStore;
