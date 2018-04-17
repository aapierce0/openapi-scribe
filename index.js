'use strict';

const WebServer = require('./openapi-webserver');
const OpenAPIParser = require('./openapi-parser');

module.exports = {
	WebServer: WebServer,
	Parser: OpenAPIParser,
};
