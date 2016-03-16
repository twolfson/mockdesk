// Karma configuration
// Generated on Thu Feb 25 2016 16:45:54 GMT-0600 (CST)
module.exports = function (config) {
  config.set({
    // Declare our dependencies
    // TODO: Remove this `require` once we are off of the `npm links`
    plugins: [require('karma-electron'), 'karma-mocha'],

    // Use a custom context file so we can load our CSS
    customContextFile: __dirname + '/test/karma-context.html',

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],

    // list of files / patterns to load in the browser
    files: [
      {pattern: 'lib/css/main.css', included: false, served: true, watched: true},
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
    browsers: ['Electron'],

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
