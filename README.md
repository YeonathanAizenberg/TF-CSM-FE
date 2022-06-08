# Blocks Swapping & Live Editor

## This project contains two parts:

1. Blocks Swapping.
2. Live Editor

## Blocks Swapping:

Implemented via vanilla JavaScript.

The source files are at "swapRelatedFiles" directory.

This app is responsible for swapping draggable blocks via
drag & drop.

There is also a css file which is included at index.html.

When running "webpack", webpack will bundle the JavaScript
files and the output is stored at "distBlocksSwap" under the name "blocks-swap.bundle.js".
this bundled file is included at index.html.

## Live Editor:

Implemented via Vue.js 3.

This Vue App is responsible for editing editable blocks via a GUI
inteface.

For now, The app can edit text and images.

When running "dev" or "build", The vue-cli will build the project into
a library and the output is stored at "dist".
this bundled file is included at index.html.

## dev & build:

dev: run dev

build: run build
