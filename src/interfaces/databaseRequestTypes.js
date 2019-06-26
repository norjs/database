/**
 *
 * @type {typeof TypeUtils}
 */
const TypeUtils = require("@norjs/utils/Type");

/**
 * @typedef {Object} DatabaseCreateRequestPayload
 * @property {T} payload - The resource to be created
 * @template T
 */
TypeUtils.defineType("DatabaseCreateRequestPayload", {
    "payload": "T"
}, {
    template: ["T"]
});

/**
 * @typedef {DatabaseCreateRequestPayload<DatabaseResourceObject>} DatabaseServiceCreateResponsePayload
 */
TypeUtils.defineType("DatabaseServiceCreateResponsePayload", {
    "payload": "DatabaseResourceObject"
});

/**
 * @typedef {Object} DatabaseServiceGetRequestPayload
 * @property {DatabaseWhereObject} [where] - If defined, these options will be used instead of query params.
 */
TypeUtils.defineType("DatabaseServiceGetRequestPayload", {
    "where": "DatabaseWhereObject"
});


/**
 * @typedef {Object} DatabaseServiceCreateRequestPayload
 * @property {DatabaseResourceObject} payload - The item to be created
 */
TypeUtils.defineType("DatabaseServiceCreateRequestPayload", {
    "payload": "DatabaseResourceObject"
});


/**
 * @typedef {Object} DatabaseServiceGetResponsePayload
 * @property {DatabaseResourceObject} payload -
 */
TypeUtils.defineType("DatabaseServiceGetResponsePayload", {
    "payload": "DatabaseResourceObject"
});


/**
 * @typedef {Object} DatabaseServiceListResponsePayload
 * @property {DatabasePageObject} payload -
 */
TypeUtils.defineType("DatabaseServiceListResponsePayload", {
    "payload": "DatabasePageObject"
});


/**
 * @typedef {Object} DatabaseServiceUpdateRequestPayload
 * @property {DatabaseWhereObject} [where] -
 * @property {DatabaseResourceObject} payload -
 */
TypeUtils.defineType("DatabaseServiceUpdateRequestPayload", {
    "where": "DatabaseWhereObject",
    "payload": "DatabaseResourceObject"
});

/**
 * @typedef {Object} DatabaseServiceUpdateResponsePayload
 * @property {DatabaseResourceObject} payload -
 */
TypeUtils.defineType("DatabaseServiceUpdateResponsePayload", {
    "payload": "DatabaseResourceObject"
});


/**
 * @typedef {Object} DatabaseServiceDeleteRequestPayload
 * @property {DatabaseWhereObject} [where] -
 */
TypeUtils.defineType("DatabaseServiceDeleteRequestPayload", {
    "where": "DatabaseWhereObject"
});

/**
 * @typedef {Object} DatabaseServiceDeleteResponsePayload
 * @property {DatabaseResourceObject} payload -
 */
TypeUtils.defineType("DatabaseServiceDeleteResponsePayload", {
    "payload": "DatabaseResourceObject"
});
