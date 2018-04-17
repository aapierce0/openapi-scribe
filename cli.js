'use strict';

const ArgumentParser = require('argparse').ArgumentParser;
const path = require('path');
const openAPIParser = require('./openapi-parser');
const Specification = openAPIParser.Specification;
const WebServer = require('./openapi-webserver');

let parser = new ArgumentParser({
    version: '0.1.0',
    addHelp: true,
    description: "Render OpenAPI documentation",
});
parser.addArgument(
    ['-f', '--file'],
    {
        help: "The path to the file to load. Defaults to 'openapi.yaml'",
        defaultValue: "openapi.yaml",
        dest: 'filePath',
    }
);
parser.addArgument(
    ['--server'],
    {
        help: "Host the web page on the specified port. If this option is not specified, the rendered HTML is returned on STDOUT",
        metavar: "PORT",
        dest: 'serverPort',
    }
);
const args = parser.parseArgs();

// Load the file from the file path
const filePath = path.resolve(args.filePath);

/// Renders the documentation.
function renderFile(callback) {
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

if (args.serverPort) {

    const webserver = new WebServer(filePath);
    webserver.listen(args.serverPort, (error, result) => {
        if (error) { console.error(error); return }
        console.log(`Listening on ${args.serverPort}`);
    });

} else {

    Specification.readFile(filePath, (error, spec) => {
        const renderer = new OpenAPIRenderer(spec);
        renderer.render((error, result) => {
            console.log(result);
        });
    });

}

