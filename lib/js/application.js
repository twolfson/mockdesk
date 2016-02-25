// Define our constructor
function Application(container) {
  // Define layers
  // TODO: Move to an application state layer
  this.layers = [];

  // Create a canvas to draw our elements on
  // TODO: Move to view layer
  // TODO: Build an underlay, canvas, and overlay "layers"
  var svgEl = document.createElement('svg');
  svgEl.setAttribute('width', 500);
  svgEl.setAttribute('height', 400);
  svgEl.setAttribute('viewBox', '0 0 500 400');
  svgEl.style.cssText = 'background: linen;';

  // Replace the container content with our element
  [].forEach.call(container.childNodes, function removeChildNode (childNode) {
    container.removeChild(childNode);
  });
  container.appendChild(svgEl);

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
