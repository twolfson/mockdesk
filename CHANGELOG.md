# mockdesk changelog
0.14.2 - Upgraded to `karma@1.1.0` and `karma-electron@4.0.0` to remove GitHub URLs

0.14.1 - Fixed lint error

0.14.0 - Added application and widget stores

0.13.0 - Restored unbind/destroy for application, repaired SVG leak from static clicks in tests

0.12.0 - Added tests for clicking on widget title and dragging widget when workspace is scrolled

0.11.0 - Refactored widget palette to reset original widget position and not bind immediately

0.10.0 - Relocated widget palette to its own view

0.9.0 - Added first iteration of drag/drop support

0.8.3 - Renamed element objects to widgets for clarity

0.8.2 - Moved to patched Karma to resolve AppVeyor issues

0.8.1 - Added CSS to make visual tests more accurate

0.8.0 - Added visual testing

0.7.1 - Moved to tarball for Karma installation

0.7.0 - Altered click behavior to generate when element palette is clicked

0.6.1 - Added `appUtils` for tests

0.6.0 - Moved to domo for HTML element creation

0.5.0 - Relocated SVG container for elements into elements themselves

0.4.0 - Added LiveReload support

0.3.0 - Added shared config support between main and renderer processes

0.2.2 - Fixed Travis CI build and added AppVeyor

0.2.1 - Added documentation

0.2.0 - Added placeholder element palette

0.1.0 - Added Electron base with tests
