'use strict';

const YAML = require('yamljs');
const _ = require('underscore');
const fs = require('fs');

// Sub-specs
const Info = require('./info.js');
const Paths = require('./paths.js');
const Components = require('./components.js');

function Specification(jsonObject) {
    this.sourceJSON = jsonObject;

    // Immediately parse the object and resolve any '$ref' objects.
    const resolvedJSON = this.resolveReferences(jsonObject);
    this.resolvedJSON = resolvedJSON;


    /// REQUIRED: The semantic version number of the OpenAPI specification version
    /// This value is a string.
    this.openapi = resolvedJSON.openapi;

    /// REQUIRED: Provides metadata about the API.
    /// This value is an Info object.
    if (jsonObject.info) {
        this.info = new Info(resolvedJSON.info);
    }

    /// REQUIRED: The paths available to the API
    if (jsonObject.paths) {
        this.paths = new Paths(resolvedJSON.paths);
    }

    if (jsonObject.components) {
        this.components = new Components(resolvedJSON.components);
    }
}



Specification.prototype.resolveReferences = function(jsonObject) {

    const rootObject = this.sourceJSON;

    /// Drill down into the object and return the key
    function navigateKeyPath(jsonObject, keyPath) {
        const nextKey = keyPath.shift();
        const nextNode = jsonObject[nextKey];

        if (keyPath.length === 0) {
            return nextNode;
        } else {
            return navigateKeyPath(nextNode, keyPath);
        }
    }

    // If this item is not an object or an array, return it as-is.
    if (!_(jsonObject).isArray() && !_(jsonObject).isObject()) {
        return jsonObject;
    }

    // If this is an array, recursively resolve the references of each item
    if (_(jsonObject).isArray()) {
        return _(jsonObject).map((jsonElement) => {
            return this.resolveReferences(jsonElement, rootObject);
        });
    }

    // If this object contains a '$ref' property, look it up.
    if (_(jsonObject).has('$ref')) {


        const referenceParts = jsonObject["$ref"].split('/');

        // naively drop the first part, because this is typically a "#";
        referenceParts.shift();

        // navigate to the node in the JSON tree.
        const resolvedObject = navigateKeyPath(rootObject, referenceParts);

        // The refenced value may have references within it.
        return this.resolveReferences(resolvedObject, rootObject);
    }


    // This must be a plain object, that is not a reference.
    // recursively drill into the object.
    return _(jsonObject).mapObject((value) => {
        return this.resolveReferences(value, rootObject);
    });
};

/// Transforms the JSON so it's easier to load into a template.
/// Objects with custom keys, like the Paths object, are transformed into
/// arrays so they can be enumerated more easily.
Specification.prototype.forRendering = function() {
    let renderTree = _(this.resolvedJSON).clone();
    renderTree.paths = this.paths.asArray();
    return renderTree;
}

Specification.readFile = function(absoluteFilePath, callback) {

    // Read the file's contents from disk
    fs.readFile(absoluteFilePath, 'utf8', (error, content) => {

        // If an error occurred, bomb out right away.
        if (error) { callback(error); return }

        let spec;
        // Try to parse the content has JSON
        try {
            const jsonSpec = JSON.parse(content);
            spec = new Specification(jsonSpec);
        } catch (error) {

            // This failed to parse as JSON. Attempt to parse as YAML
            const yamlSpec = YAML.parse(content);
            spec = new Specification(yamlSpec);
        }

        callback(null, spec);
    });
};

module.exports = Specification;