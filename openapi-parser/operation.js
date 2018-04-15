'use strict';

const _ = require('underscore');
const Parameter = require('./parameter.js');
const Responses = require('./responses.js');

function Operation(jsonObject) {

    /// A list of tags for API document control. Tags can be used for logical grouping of operations by resources or any
    /// other qualifier.
    this.tags = jsonObject.tags;

    /// A short summary of what the operation does.
    this.summary = jsonObject.summary;

    /// A verbose explanation of the operation behavior.
    this.description = jsonObject.description;

    /// A unique string to identify the operation.
    this.operationId = jsonObject.operationId;

    /// Map the parameters
    if (jsonObject.parameters) {
        this.parameters = _(jsonObject.parameters).map((jsonParameter) => {
            return new Parameter(jsonParameter);
        });
    }



    /// TODO: Parse request body
    this.requestBody = jsonObject.requestBody;

    /// TODO: Parse responses
    this.responses = new Responses(jsonObject.responses);
}

Operation.prototype.flatten = function() {
    const flattened = _(this).clone();
    flattened.responses = this.responses.asArray();
    return flattened;
}

module.exports = Operation;