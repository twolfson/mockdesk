// Load in our dependencies
var Menu = require('electron').Menu;

// Load in JSON for our menus (e.g. `./menus/linux.json`)
// https://github.com/atom/electron-starter/blob/96f6117b4c1f33c0881d504d655467fc049db433/src/browser/appmenu.coffee#L15
var menuTemplate = require('./menus/' + process.platform + '.json');

// Define a function to set up our application menu
exports.init = function (mockdesk) {
  // Parse and set up our menu
  // https://github.com/atom/electron-starter/blob/96f6117b4c1f33c0881d504d655467fc049db433/src/browser/appmenu.coffee#L27-L41
  function bindMenuItems(menuItems) {
    menuItems.forEach(function bindMenuItemFn (menuItem) {
      // If there is a role, continue
      if (menuItem.role !== undefined) {
        return;
      }

      // If there is a separator, continue
      if (menuItem.type === 'separator') {
        return;
      }

      // If there is a submenu, recurse it
      if (menuItem.submenu) {
        bindMenuItems(menuItem.submenu);
        return;
      }

      // Otherwise, find the function for our command
      var cmd = menuItem.command;
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
        menuItem.click = mockdesk.toggleLiveReload;
      } else {
        throw new Error('Could not find function for menu command "' + cmd + '" ' +
          'under label "' + menuItem.label + '"');
      }
    });
  }
  bindMenuItems(menuTemplate.menu);
  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate.menu));
};
