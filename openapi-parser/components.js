'use strict';

const _ = require('underscore');
const Schema = require('./schema.js');

function Components(jsonObject) {

    this.schemas = _(jsonObject.schemas).mapObject((jsonSchema) => {
        return new Schema(jsonSchema);
    });
}

module.exports = Components;