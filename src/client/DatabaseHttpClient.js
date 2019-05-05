const _ = require('lodash');

/**
 *
 * @type {{stop: string, fetchEvents: string, start: string, trigger: string, setEvents: string}}
 */
const ROUTES = {
    // setEvents: '/setEvents'
};

/**
 *
 * @type {typeof TypeUtils}
 */
const TypeUtils = require("@norjs/utils/Type");

/**
 *
 * @type {{socket: Symbol}}
 */
const PRIVATE = {
    client: Symbol('client')
};

/**
 * Implements an interface to call database actions over an HttpClient.
 *
 * @implements {DatabaseStorage}
 */
class DatabaseHttpClient {

    /**
     *
     * @param client {HttpClient}
     */
    constructor (client) {

        TypeUtils.assert(client, "HttpClient");

        /**
         * @member {HttpClient}
         */
        this[PRIVATE.client] = client;

    }

    /**
     * Create a new object in the database.
     *
     * @param object {DatabaseResourceObject}
     * @returns {Promise.<DatabaseResourceObject>}
     */
    createResource (object) {

        TypeUtils.assert(object, "DatabaseResourceObject");

        return this[PRIVATE.client].postJson(
            ROUTES.create,
            {},
            {
                input: object
            }
        ).then(
            /**
             *
             * @param response {DatabaseServiceCreateResponsePayload}
             * @returns {TriggerEventServiceResponse}
             */
            response => {
                TypeUtils.assert(response, "DatabaseServiceCreateResponsePayload");
                return response.payload;
            }
        );

    }

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

TypeUtils.defineType("DatabaseHttpClient", TypeUtils.classToTestType(DatabaseHttpClient));

/**
 *
 * @type {typeof DatabaseHttpClient}
 */
module.exports = DatabaseHttpClient;
