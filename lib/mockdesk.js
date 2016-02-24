// Load in our dependencies
var app = require('electron').app;
var BrowserWindow = require('electron').BrowserWindow;
var _ = require('underscore');
var program = require('commander');
var replify = require('replify');
var assets = require('./assets');
var appMenu = require('./app-menu');
var appTray = require('./app-tray');
var Config = require('./config');
var getLogger = require('./logger');
var shortcuts = require('./shortcuts');

// Load in package info
var pkg = require('../package.json');

// TODO: Copy remaining replify setup (I think there's a package.json and README part)
// TODO: Continue to scrub `gme`/Google mentions

// Handle CLI arguments
program
  .version(pkg.version)
  .option('--verbose', 'Display verbose log output in stdout')
  .option('--debug-repl', 'Starts a `replify` server as `mockdesk` for debugging')
  // Allow unknown Chromium flags
  // https://github.com/atom/electron/blob/v0.26.0/docs/api/chrome-command-line-switches.md
  .allowUnknownOption();

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

// Generate a config based on our CLI arguments
// DEV: We need to build cliConfig off of options since we are using `camelCase` from `commander`
// https://github.com/tj/commander.js/blob/v2.9.0/index.js#L1046-L1050
function camelcase(flag) {
  return flag.split('-').reduce(function (str, word) {
    return str + word[0].toUpperCase() + word.slice(1);
  });
}
var cliConfig = _.object(program._cliConfigKeys.map(function getCliValue (dashCaseKey) {
  var camelCaseKey = camelcase(dashCaseKey);
  return [dashCaseKey, program[camelCaseKey]];
}));
logger.debug('CLI options overriding config', cliConfig);
var config = new Config(cliConfig, program._cliInfo);
logger.debug('Generated starting config options', config.getAll());

// Define helpers for controlling/sending messages to our window
// https://github.com/atom/electron-starter/blob/96f6117b4c1f33c0881d504d655467fc049db433/src/browser/application.coffee#L87-L104
// DEV: We are choosing to dodge classes to avoid `.bind` calls
// DEV: This must be in the top level scope, otherwise our window gets GC'd
var gme = {
  browserWindow: null,
  config: config,
  controlPlayPause: function () {
    if (gme.browserWindow && gme.browserWindow.webContents) {
      logger.debug('Sending `control:play-pause` to browser window');
      gme.browserWindow.webContents.send('control:play-pause');
    } else {
      logger.debug('`control:play-pause` requested but couldn\'t find browser window');
    }
  },
  controlNext: function () {
    if (gme.browserWindow && gme.browserWindow.webContents) {
      logger.debug('Sending `control:next` to browser window');
      gme.browserWindow.webContents.send('control:next');
    } else {
      logger.debug('`control:next` requested but couldn\'t find browser window');
    }
  },
  controlPrevious: function () {
    if (gme.browserWindow && gme.browserWindow.webContents) {
      logger.debug('Sending `control:previous` to browser window');
      gme.browserWindow.webContents.send('control:previous');
    } else {
      logger.debug('`control:previous` requested but couldn\'t find browser window');
    }
  },
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
      icon: assets['icon-32'],
      width: 400
    });
    aboutWindow.loadURL('data:text/html,' + info);
  },
  openConfigWindow: function () {
    logger.debug('Showing `config` window for `mockdesk`');
    // DEV: configWindow will be garbage collection automatically
    var configWindow = new BrowserWindow({
      height: 440,
      icon: assets['icon-32'],
      width: 620
    });
    configWindow.loadURL('file://' + __dirname + '/views/config.html');
  },
  quitApplication: function () {
    logger.debug('Exiting `mockdesk`');
    app.quit();
  },
  reloadWindow: function () {
    logger.debug('Reloading focused browser window');
    BrowserWindow.getFocusedWindow().reload();
  },
  showMinimizedWindow: function () {
    // DEV: Focus is necessary when there is no taskbar and we have lost focus for the app
    gme.browserWindow.restore();
    gme.browserWindow.focus();
  },
  showInvisibleWindow: function () {
    gme.browserWindow.show();
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
  },
  toggleMinimize: function () {
    if (gme.browserWindow) {
      var isMinimized = gme.browserWindow.isMinimized();
      logger.debug('Toggling browser window minimization', {
        isMinimized: isMinimized
      });
      if (isMinimized) {
        gme.showMinimizedWindow();
      } else {
        gme.browserWindow.minimize();
      }
    } else {
      logger.debug('Browser window minimization toggling requested but browser window as not found');
    }
  },
  toggleVisibility: function () {
    if (gme.browserWindow) {
      var isVisible = gme.browserWindow.isVisible();
      logger.debug('Toggling browser window visibility', {
        isVisible: isVisible
      });
      if (isVisible) {
        gme.browserWindow.hide();
      } else {
        gme.showInvisibleWindow();
      }
    } else {
      logger.debug('Browser window visibility toggling requested but browser window as not found');
    }
  }
};

// Assign tray click behavior
gme.onTrayClick = (config.get('hide-via-tray') || config.get('minimize-to-tray')) ?
  gme.toggleVisibility : gme.toggleMinimize;
gme.onRaise = (config.get('hide-via-tray') || config.get('minimize-to-tray')) ?
  gme.showInvisibleWindow : gme.showMinimizedWindow;

// Create our browser window
var windowOpts = {
  height: 920,
  icon: assets['icon-32'],
  // Load in our bindings on the page
  preload: __dirname + '/browser.js',
  'skip-taskbar': config.get('skip-taskbar'),
  'use-content-size': true,
  width: 1024
};
logger.info('App ready. Opening mockdesk window', {
  options: windowOpts,
  processVersions: process.versions,
  version: pkg.version
});
gme.browserWindow = new BrowserWindow(windowOpts);
// gme.browserWindow.loadURL('https://play.google.com/music/listen');

// If hiding to tray was requested, trigger a visibility toggle when the window is minimized
if (config.get('minimize-to-tray')) {
  gme.browserWindow.on('minimize', gme.toggleVisibility);
}

// When our window is closed, clean up the reference to our window
gme.browserWindow.on('closed', function handleWindowClose () {
  logger.debug('Browser window closed, garbage collecting `browserWindow`');
  gme.browserWindow = null;
});

// Save browser window context to replify
// http://dshaw.github.io/2012-10-nodedublin/#/
if (program.debugRepl) {
  var replServer = replify('google-music-electron', null, {gme: gme});
  replServer.on('listening', function handleReplServerListen () {
    var socketPath = replServer.address();
    logger.info('Debug repl opened at "%s". This should be accessible via `npm run debug-repl`', socketPath);
  });
}

// Set up our application menu, tray, and shortcuts
appMenu.init(gme);
appTray.init(gme);
shortcuts.init(gme);
