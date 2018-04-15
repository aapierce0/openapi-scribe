'use strict';

const Schema = require('./schema.js');

function Parameter(jsonObject) {

    /// The name of the parameter.
    /// String.
    this.name = jsonObject.name;

    /// The location of the parameter.
    /// String.
    this.in = jsonObject.in;

    /// The description of the parameter.
    /// String.
    this.description = jsonObject.description;

    /// Whether this parameter is required.
    /// Boolean.
    this.required = jsonObject.required;

    /// Whether this parameter is deprecated.
    /// Boolean.
    this.deprecated = jsonObject.deprecated;

    /// Whether this parameter may be empty.
    /// Boolean.
    this.allowEmptyValue = jsonObject.allowEmptyValue;


    /// The schema of this parameter (e.g. "String")
    if (jsonObject.schema) {
        this.schema = new Schema(jsonObject.schema);
    }
}

module.exports = Parameter;