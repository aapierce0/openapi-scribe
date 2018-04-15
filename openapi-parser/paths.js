'use strict';

const _ = require('underscore');
const PathItem = require('./path-item.js');

function Paths(jsonObject) {

    const parsedObject = _(jsonObject).mapObject((value) => {
        return new PathItem(value);
    });

    _(this).extendOwn(parsedObject);
}

Paths.prototype.asArray = function() {
    return _(this).map((value, key) => {
        return {
            path: key,
            pathItem: value.flattenMethods(),
        };
    });
};


module.exports = Paths;