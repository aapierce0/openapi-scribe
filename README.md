#OpenAPI Scribe

Hosts an OpenAPI 3.0 document and serves it as HTML.

I started because I was unsatisified with the existing OpenAPI 3.0 rendering tools. They were either too complex or badly designed.

This project aims to provide a simple tool for serving Open API 3.0 documentation in a layout that is easy to read and navigate.

## Usage

1. Install nodejs (https://nodejs.org)
2. Install project dependencies (`npm install`)
3. Run: `node ./cli.js -f FILEPATH --server PORT`

## Wishlist

These features are **not** supported, but I hope to one day add support for them.

* Add ability to integrate into existing express project
* Make the project installable as a command-line tool using the `npm -g` option
* Load external references from `$ref`
* Identify and present validation errors.