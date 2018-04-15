'use strict';

const _ = require('underscore');
const Operation = require('./operation.js');
const Parameter = require('./parameter.js');

// Operations for each verb
const verbs = [
    'get',
    'put',
    'post',
    'delete',
    'options',
    'head',
    'patch',
    'trace',
];

function PathItem(jsonObject) {

    /// The summary of this path
    this.summary = jsonObject.summary;

    this.description = jsonObject.description;


    const providedVerbs = _(jsonObject).pick(verbs);

    // All the verbs have the same schema
    const parsedVerbs = _(providedVerbs).mapObject((value) => {
        return new Operation(value);
    });

    _(this).extendOwn(parsedVerbs);



    /// Map the parameters
    if (jsonObject.parameters) {
        this.parameters = _(jsonObject.parameters).map((jsonParameter) => {
            return new Parameter(jsonParameter);
        });
    }

    // this.servers;
}

PathItem.prototype.flattenMethods = function() {
    const providedVerbs = _(this).pick(verbs);
    const methodsArray = _(providedVerbs).map((operation, verb) => {
        return {
            method: verb,
            operation: operation.flatten(),
        };
    })

    const clonedItem = _(this).omit(verbs);
    clonedItem.methods = methodsArray;
    return clonedItem;
}

module.exports = PathItem;