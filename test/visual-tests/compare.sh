#!/usr/bin/env bash
# Exit on first error
set -e

# For each of the screenshots in expected screenshots
bad_matches=""
for expected_image in test/visual-tests/expected-screenshots/*; do
  # Compare the images
  set +e
  echo "$expected_image"
  set -e
done
