# mockdesk [![Build status](https://travis-ci.org/twolfson/mockdesk.svg?branch=master)](https://travis-ci.org/twolfson/mockdesk) [![Build status](https://ci.appveyor.com/api/projects/status/r44mu999ts6fa4j7/branch/master?svg=true)](https://ci.appveyor.com/project/twolfson/mockdesk/branch/master)

Desktop application for creating mockups

This was constructed out of frustration due to the lack of mockup tools for Linux as well as the existing one's feature incompleteness.

## Work in progress
This project is still a work in progress and not ready for consumption. Use at your own risk.

This notice will be removed when it's ready.

## Proprietary notice
We are still undecided on whether to license this freely or to make this a proprietary product. This is being constructed during would-be professional employment time and is blocking desired activities. As a result, we are torn between requesting for compensation and making an open product (from our experience, the donation model works very poorly).

For now, feel free to browse the source but usage of this code in any environment is prohibited. If you have any feedback on this topic, feel free to [create an issue](https://github.com/twolfson/mockdesk/issues/new).

## Requirements
- [npm][], usually installed with [Node.js][]

[npm]: http://npmjs.org/
[Node.js]: http://nodejs.org/

## Getting Started
Install `mockdesk` locally via the following steps:

```bash
# Clone our repository
git clone https://github.com/twolfson/mockdesk
cd mockdesk

# Install our dependencies
npm install

# Start our application
npm start
```

## Documentation
### CLI
We have a few CLI options available:

```
  Usage: mockdesk [options]

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
    --verbose      Display verbose log output in stdout
    --debug-repl   Starts a `replify` server as `mockdesk` for debugging
    --livereload  Connect browser windows to LiveReload server
```

### File system
Our file system structure is currently unstable but the current structure is:

- `bin/` - Executable scripts (e.g. `mockdesk.js` which launches our application)
- `lib/` - Container for all application files
- `test/` - Container for application tests
- `CHANGELOG.md` - Record of changes in the project
- `README.md` - Documentation for the project

### Automated refreshes
We support a [LiveReload][] integration via `gulp-livereload`. To start the LiveReload server, run:

```bash
npm run develop
```

To enable the LiveReload script in `mockdesk`, use the `--livereload` CLI flag:

```bash
bin/mockdesk.js --livereload
# or use the following to enable all developer friendly flags
# npm run start-develop
```

[LiveReload]: http://livereload.com/

### Debug scripts
During development, it can be practical to automatically run a script that performs actions on load (e.g. click on a rectangle). We support this via a magic variable on `sessionStorage`.

To load a script at load time, open the console and specify the path to our script:

```js
// Load `lib/js/scripts/click-rectangle.js`
// DEV: Path is relative to `lib/views/index.html`
sessionStorage.debugScript = '../js/scripts/click-rectangle.js';
```

Then, refresh the page and the script will automatically run.

### Testing
To run the test suite once, run the following:

```bash
npm test
```

To run the test suite continuously, run the following:

```bash
npm run develop-test
```

#### Visual tests
Our test suite supports visual diff testing via Electron's `capturePage` method and `image-diff`. Currently, this only runs locally since the UI is in flux.

To capture a new set of screenshots, run the following:

```bash
# Captures new screenshots to `test/visual-tests/expected-screenshots`
npm run test-visual-capture
```

To compare with an existing set of screenshots, run the following:

```bash
# Captures new screenshots to `test/visual-tests/actual-screenshots`
#   and runs `image-diff` between pairs of screenshots
#   Diff images are generated to `test/visual-tests/diff-screenshots`
npm run test-visual-compare
```

### Debug REPL
When `mockdesk` is started with a `--debug-repl` flag, it opens a `replify` server at `/tmp/repl/mockdesk.sock`.

To connect to this server's REPL, run the following command:

```bash
npm run debug-repl
# Example usage:
# > mockdesk@0.2.0 debug-repl /home/todd/github/mockdesk
# > rc /tmp/repl/mockdesk.sock
#
# mockdesk> mockdesk
# { browserWindow: ...
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint via `npm run lint` and test via `npm test`.

## License
Copyright (c) 2016 Todd Wolfson, all rights reserved
