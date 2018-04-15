'use strict';

function Info(jsonObject) {

    /// REQUIRED: The title of the application
    /// This value is a string.
    this.title = jsonObject.title;

    /// The description of the application.
    /// This value is a string.
    this.description = jsonObject.description;

    /// A URL to the Terms of Service for the API.
    /// This value is a string, in URL format.
    this.termsOfService = jsonObject.termsOfService;

    /// REQUIRED: The version of the OpenAPI document.
    /// This value is a string.
    this.version = jsonObject.version;



    // TODO: Parse these items out

    /// The contact information for the API. Must be a contact object.
    this.contact = jsonObject.contact;

    /// The license information for the API. Must be a license object.
    this.license = jsonObject.license;
}

module.exports = Info;