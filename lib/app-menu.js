// Load in our dependencies
var ipcMain = require('electron').ipcMain;
var Menu = require('electron').Menu;
var MenuItem = require('electron').MenuItem;

// Load in JSON for our menus (e.g. `./menus/linux.json`)
// https://github.com/atom/electron-starter/blob/96f6117b4c1f33c0881d504d655467fc049db433/src/browser/appmenu.coffee#L15
var menuTemplate = require('./menus/' + process.platform + '.json');

// Define a function to set up our application menu
exports.init = function (mockdesk) {
  // Parse and set up our menu
  // https://github.com/atom/electron-starter/blob/96f6117b4c1f33c0881d504d655467fc049db433/src/browser/appmenu.coffee#L27-L41
  // https://github.com/atom/electron/blob/v0.36.10/atom/browser/api/lib/menu.js#L300-L333
  function createMenuFromTemplate(menuParams) {
    // Create a menu item for each of our parameters
    var menuItems = menuParams.map(function createMenuItem (menuItemParams) {
      // If there is a role, continue
      if (menuItemParams.role !== undefined) {
        return new MenuItem(menuItemParams);
      }

      // If there is a separator, continue
      if (menuItemParams.type === 'separator') {
        return new MenuItem(menuItemParams);
      }

      // If there is a submenu, recurse it
      if (menuItemParams.submenu) {
        menuItemParams.submenu = createMenuFromTemplate(menuItemParams.submenu);
        return new MenuItem(menuItemParams);
      }

      // Create a menu item that we can bind a click handler to
      var menuItem = new MenuItem(menuItemParams);

      // Otherwise, find the function for our command
      var cmd = menuItemParams.command;
      if (cmd === 'application:about') {
        menuItem.click = mockdesk.openAboutWindow;
      } else if (cmd === 'application:quit') {
        menuItem.click = mockdesk.quitApplication;
      } else if (cmd === 'window:reload') {
        menuItem.click = mockdesk.reloadWindow;
      } else if (cmd === 'window:toggle-dev-tools') {
        menuItem.click = mockdesk.toggleDevTools;
      } else if (cmd === 'window:toggle-full-screen') {
        menuItem.click = mockdesk.toggleFullScreen;
      } else if (cmd === 'window:toggle-livereload') {
        ipcMain.on('get:livereload', function handleGetLiveReload (evt) {
          console.log('wat', menuItem.checked, menuItem);
          evt.returnValue = menuItem.checked;
        });
        menuItem.click = mockdesk.toggleLiveReloadViaMenuItem;
      } else {
        throw new Error('Could not find function for menu command "' + cmd + '" ' +
          'under label "' + menuItem.label + '"');
      }

      // Return our menu item
      return menuItem;
    });

    // Create and return a menu with our items
    var menu = new Menu();
    menuItems.forEach(function appendItem (menuItem) {
      menu.append(menuItem);
    });
    return menu;
  }
  Menu.setApplicationMenu(createMenuFromTemplate(menuTemplate.menu));
};
