#!/usr/bin/env bash
# Exit on first error
set -e

# Navigate to our working directory
cd test/visual-tests

# Create a diff directory
if test -d diff-screenshots; then
  rm -r diff-screenshots
fi
mkdir -p diff-screenshots

# For each of the screenshots in expected screenshots
has_bad_match="FALSE"
for expected_image in expected-screenshots/*; do
  # Resolve our actual image to compare to
  filename="$(basename "$expected_image")"
  actual_image="actual-screenshots/$filename"
  diff_image="diff-screenshots/$filename"

  # Compare the images
  echo -n "Comparing: \"$actual_image\" to \"$expected_image\"... " 1>&2
  set +e
  image-diff "$actual_image" "$expected_image" "$diff_image"
  images_are_different="$?"
  set -e

  # Output and save our result
  if test "$images_are_different" = "1"; then
    echo "DIFFERENT" 1>&2
    has_bad_match="TRUE"
  else
    echo "SAME" 1>&2
  fi
done

# If there was a bad match, exit with a bad code
if test "$has_bad_match" = "TRUE"; then
  echo "" 1>&2
  echo "Image differences can be found in \"$PWD/diff-screenshots\"" 1>&2
  exit 1
fi
