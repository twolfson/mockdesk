// Define our constants
var SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

// Define our constructor
function Application(container) {
  // Define layers
  // TODO: Move to an application state layer
  this.layers = [];

  // Create a canvas to draw our elements on
  // TODO: Move to view layer
  // TODO: Build an underlay, canvas, and overlay "layers"
  var svgEl = document.createElementNS(SVG_NAMESPACE, 'svg');
  svgEl.setAttribute('width', 500);
  svgEl.setAttribute('height', 400);
  svgEl.setAttribute('viewBox', '0 0 500 400');
  svgEl.style.cssText = 'background: linen;';
  var rectEl = document.createElementNS(SVG_NAMESPACE, 'rect');
  rectEl.setAttribute('width', '100');
  rectEl.setAttribute('height', '100');
  rectEl.setAttribute('x', '0');
  rectEl.setAttribute('fill', '#008d46');
  svgEl.appendChild(rectEl);

  // Set up mouse bindings
  // TODO: Figure out better place to put these bindings (e.g. method)
  svgEl.addEventListener('click', this.handleClick.bind(this));

  // Replace the container content with our element
  [].forEach.call(container.childNodes, function removeChildNode (childNode) {
    container.removeChild(childNode);
  });
  container.appendChild(svgEl);

  // Save our svgEl for later
  this.svgEl = svgEl;

  // TODO: Prob accept container and draw onto it...
  //   but let's get an Electron app set up now...
  //   1. SVG on HTML
  //   2. Click on page to create new element
  //   3. Hot code integration so we don't constantly reboot/reload page
  //      Hot code swap is ideal but LiveReload is tolerable
}
Application.prototype = {
  // TODO: Rename to appendChild?
  appendElement: function (el) {
    // Add element to our layers and return fluent
    this.layers.push(el);
    this.svgEl.appendChild(el);
    return this;
  },
  // When someone clicks on the SVG, add an element at that position
  // TODO: This logic is temporary (should be drag/drop from element palette
  // TODO: Figure out better place to put these bindings (e.g. method)
  handleClick: function (evt) {
    // Create an element at our requested location
    // TODO: It feels weird to tell item its x/y...
    // TODO: Move to definition in `lib/js/elements`
    var rectEl = document.createElementNS(SVG_NAMESPACE, 'rect');
    rectEl.setAttribute('width', '100');
    rectEl.setAttribute('height', '100');
    // DEV: If we ever add a menu, then we will need to remove offset already existing on SVG
    //   i.e. `x` is on SVG's canvas NOT on page
    rectEl.setAttribute('x', evt.clientX);
    rectEl.setAttribute('y', evt.clientY);
    rectEl.setAttribute('fill', '#008d46');

    // Add our layer
    this.appendElement(rectEl);
  }
};

// Export our function
window.Application = Application;
