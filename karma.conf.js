// Karma configuration
// Generated on Thu Feb 25 2016 16:45:54 GMT-0600 (CST)
module.exports = function (config) {
  config.set({
    // Declare our dependencies
    plugins: ['karma-electron', 'karma-mocha'],

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],

    // list of files / patterns to load in the browser
    files: [
      // Serve and load our CSS
      {pattern: 'lib/css/main.css', included: true, served: true, watched: true},

      // Serve and load our JS
      'test/*.js'
    ],

    // list of files to exclude
    exclude: [
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    // DEV: Support nodeIntegration via a preprocessor and no iframe
    preprocessors: {
      'test/**/*.js': ['electron']
    },
    client: {
      useIframe: false
    },

    // Set up timeout to be a little higher than mocha
    browserNoActivityTimeout: 5000,

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Electron-Visible'],

    customLaunchers: {
      'Electron-Visible': {
        base: 'Electron',
        flags: ['--show']
      }
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  });
};
