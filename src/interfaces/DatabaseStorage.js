/**
 *
 * @type {typeof TypeUtils}
 */
const TypeUtils = require("@norjs/utils/Type");

/**
 * @typedef {string|number|boolean|null} DatabaseScalarVariable
 */
TypeUtils.defineType("DatabaseScalarVariable", "string|number|boolean|null");

/**
 * @typedef {DatabaseScalarVariable|Array.<DatabaseVariable>|Object.<string,DatabaseVariable>} DatabaseVariable
 */
TypeUtils.defineType("DatabaseVariable", "DatabaseScalarVariable"); // Workaround until TypeUtils understands recursive declarations
TypeUtils.defineType("DatabaseVariable", "DatabaseScalarVariable|Array.<DatabaseVariable>|Object.<string,DatabaseVariable>");

/**
 * @typedef {Object.<string, DatabaseVariable>} DatabaseResourceObject
 */
TypeUtils.defineType("DatabaseResourceObject", "Object.<string, DatabaseVariable>");

/**
 * @typedef {Object.<string, DatabaseVariable>} DatabaseWhereObject
 */
TypeUtils.defineType("DatabaseWhereObject", "Object.<string, DatabaseVariable>");

/**
 * @typedef {Object} DatabaseListOptionsObject
 * @property {number} [page] - Page number, starting from 0
 * @property {number} [size] - Page size, defaults to 10
 * @property {DatabaseWhereObject} [where] -
 */
TypeUtils.defineType("DatabaseListOptionsObject", {
    "page": "number",
    "size": "number",
    "where": "DatabaseWhereObject",
});

/**
 * @typedef {Object} DatabasePageObject
 * @property {number} page - Page number, starting from 0
 * @property {number} size - Page size, defaults to 10
 * @property {number} total - Total amount of resources in the database
 * @property {DatabaseWhereObject} [where] - Where options from the list options object
 * @property {Array.<DatabaseResourceObject>} content - Items on this page
 */
TypeUtils.defineType("DatabasePageObject", {
    "page": "number",
    "size": "number",
    "total": "number",
    "where": "DatabaseWhereObject",
    "content": "Array.<DatabaseResourceObject>",
});

/**
 * Defines common interface to access document based database storage
 *
 * @interface
 */
class DatabaseStorage {

    /**
     * Create a new object in the database.
     *
     * @param object {DatabaseResourceObject}
     * @returns {Promise.<DatabaseResourceObject>}
     */
    createResource (object) {}

    /**
     * Fetch single resource from the database.
     *
     * If `where` matches more than one, an error is thrown.
     *
     * @param where {DatabaseWhereObject}
     * @returns {Promise.<DatabaseResourceObject>}
     */
    getResource (where) {}

    /**
     * Fetch multiple resources from the database.
     *
     * @param options {DatabaseListOptionsObject|undefined}
     * @returns {Promise.<DatabasePageObject>}
     */
    listResources (options = undefined) {}

    /**
     * Update a resource in the database with new values from `object`.
     *
     * @param object {DatabaseResourceObject}
     * @param where {DatabaseWhereObject|undefined}
     * @returns {Promise.<DatabaseResourceObject>}
     */
    updateResource (object, where = undefined) {}

    /**
     * Delete a resource from the database.
     *
     * @param where {DatabaseWhereObject}
     * @returns {Promise.<DatabaseResourceObject>}
     */
    deleteResource (where) {}

}

TypeUtils.defineType(
    "DatabaseStorage",
    TypeUtils.classToObjectPropertyTypes(DatabaseStorage),
    {
        acceptUndefinedProperties: true
    }
);

/**
 *
 * @type {typeof DatabaseStorage}
 */
module.exports = DatabaseStorage;
