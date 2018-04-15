'use strict';

const _ = require('underscore');

function Responses(jsonObject) {
    _(this).extendOwn(jsonObject);
}

Responses.prototype.asArray = function() {
    return _(this).map((value, key) => {
        return {
            responseCode: key,
            content: value
        };
    })
};

module.exports = Responses;