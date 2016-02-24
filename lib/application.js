// Define our constructor
function Application() {
  // Define layers
  // TODO: Move to an application state
  this.layers = [];
}
Application.prototype = {
  appendElement: function (el) {
    // Add element to our layers and return fluent
    this.layers.push(el);
    return this;
  }
};

// Export our function
module.exports = Application;
