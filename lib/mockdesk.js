// Load in our dependencies
var app = require('electron').app;
var BrowserWindow = require('electron').BrowserWindow;
var program = require('commander');
var replify = require('replify');
var appMenu = require('./app-menu');
var getLogger = require('./logger');

// Load in package info
var pkg = require('../package.json');

// Handle CLI arguments
program
  .version(pkg.version)
  .option('--verbose', 'Display verbose log output in stdout')
  .option('--debug-repl', 'Starts a `replify` server as `mockdesk` for debugging')
  // Allow unknown Chromium flags
  // https://github.com/atom/electron/blob/v0.26.0/docs/api/chrome-command-line-switches.md
  .allowUnknownOption();
program.parse(process.argv);

// Generate a logger
var logger = getLogger({verbose: program.verbose});

// Log our CLI arguments
logger.debug('CLI arguments received', {argv: process.argv});

// When all Windows are closed
app.on('window-all-closed', function handleWindowsClosed () {
  // If we are not on OSX, exit
  // DEV: OSX requires users to quit via the menu/cmd+q
  if (process.platform !== 'darwin') {
    logger.debug('All windows closed. Exiting application');
    app.quit();
  } else {
    logger.debug('All windows closed but not exiting because OSX');
  }
});

// Define helpers for controlling/sending messages to our window
// https://github.com/atom/electron-starter/blob/96f6117b4c1f33c0881d504d655467fc049db433/src/browser/application.coffee#L87-L104
// DEV: We are choosing to dodge classes to avoid `.bind` calls
// DEV: This must be in the top level scope, otherwise our window gets GC'd
var mockdesk = {
  browserWindow: null,
  config: program,
  logger: logger,
  openAboutWindow: function () {
    logger.debug('Showing `about` window for `mockdesk`');
    var info = [
      // https://github.com/corysimmons/typographic/blob/2.9.3/scss/typographic.scss#L34
      '<div style="text-align: center; font-family: \'Helvetica Neue\', \'Helvetica\', \'Arial\', \'sans-serif\'">',
        '<h1>mockdesk</h1>',
        '<p>',
          'Version: ' + pkg.version,
          '<br/>',
          'Electron version: ' + process.versions.electron,
          '<br/>',
          'Node.js version: ' + process.versions.node,
          '<br/>',
          'Chromium version: ' + process.versions.chrome,
        '</p>',
      '</div>'
    ].join('');
    // DEV: aboutWindow will be garbage collection automatically
    var aboutWindow = new BrowserWindow({
      height: 180,
      // TODO: Add icon back
      width: 400
    });
    aboutWindow.loadURL('data:text/html,' + info);
  },
  quitApplication: function () {
    logger.debug('Exiting `mockdesk`');
    app.quit();
  },
  reloadWindow: function () {
    logger.debug('Reloading focused browser window');
    BrowserWindow.getFocusedWindow().reload();
  },
  toggleDevTools: function () {
    logger.debug('Toggling developer tools in focused browser window');
    BrowserWindow.getFocusedWindow().toggleDevTools();
  },
  toggleFullScreen: function () {
    var focusedWindow = BrowserWindow.getFocusedWindow();
    // Move to other full screen state (e.g. true -> false)
    var wasFullScreen = focusedWindow.isFullScreen();
    var toggledFullScreen = !wasFullScreen;
    logger.debug('Toggling focused browser window full screen', {
      wasFullScreen: wasFullScreen,
      toggledFullScreen: toggledFullScreen
    });
    focusedWindow.setFullScreen(toggledFullScreen);
  }
};

// When Electron is done loading, launch our applicaiton
app.on('ready', function handleReady () {
  // Create our browser window
  var windowOpts = {
    height: 920,
    // TODO: Add icon back
    'use-content-size': true,
    width: 1024
  };
  logger.info('App ready. Opening mockdesk window', {
    options: windowOpts,
    processVersions: process.versions,
    version: pkg.version
  });
  var browserWindow = new BrowserWindow(windowOpts);
  mockdesk.browserWindow = browserWindow;
  mockdesk.browserWindow.loadURL('file://' + __dirname + '/views/index.html');

  // When our window is closed, clean up the reference to our window
  browserWindow.on('closed', function handleWindowClose () {
    logger.debug('Browser window closed, garbage collecting `browserWindow`');
    mockdesk.browserWindow = null;
  });

  // Save browser window context to replify
  // http://dshaw.github.io/2012-10-nodedublin/#/
  if (program.debugRepl) {
    var replServer = replify('mockdesk', null, {mockdesk: mockdesk});
    replServer.on('listening', function handleReplServerListen () {
      var socketPath = replServer.address();
      logger.info('Debug repl opened at "%s". This should be accessible via `npm run debug-repl`', socketPath);
    });
  }

  // Set up our application menu, tray, and shortcuts
  appMenu.init(mockdesk);
});
