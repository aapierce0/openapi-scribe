'use strict';

const path = require('path');
const express = require('express');
const Specification = require('../openapi-parser').Specification;

function OpenAPIWebserver(filePath) {
    this.filePath = filePath;
}

function fetchOpenAPIDocument(callback) {
    Specification.readFile(filePath, (error, spec) => {

        // If an error occurred, pass it up.
        if (error) { callback(error); return }

        // Render the open API spec.
        const renderer = new OpenAPIRenderer(spec);
        renderer.render((error, result) => {
            callback(error, result)
        });
    });
}

OpenAPIWebserver.prototype.listen = function(port, callback) {

    const app = express();
    app.get('/openapi.json', (request, response) => {
        Specification.readFile(this.filePath, (error, spec) => {
            response.send(spec.resolvedJSON);
            response.end();
        });
    });

    const staticPath = path.join(__dirname, 'static');
    app.use(express.static(staticPath));
    app.listen(port, callback);
};

module.exports = OpenAPIWebserver;