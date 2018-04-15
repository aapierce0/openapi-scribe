'use strict';

function Schema(jsonObject) {

    /// The type of the object. This value must be a string.
    this.type = jsonObject.type;

    /// When this schema is an object, this property enumerates the possible properties
    this.properties = jsonObject.properties;

    /// An array listing the required properties in the schema.
    this.required = jsonObject.required;

    /// When the schema is an array, the items property lists the
    if (jsonObject.items) {
        this.items = new Schema(jsonObject.items);
    }
}

module.exports = Schema;