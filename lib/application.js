// Define our constructor
function Application() {
  // Define layers
  // TODO: Move to an application state
  this.layers = [];

  // TODO: Prob accept container and draw onto it...
  //   but let's get an Electron app set up now...
  //   1. SVG on HTML
  //   2. Click on page to create new element
  //   3. Hot code integration so we don't constantly reboot/reload page
  //      Hot code swap is ideal but LiveReload is tolerable
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
