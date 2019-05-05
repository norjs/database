// Interfaces
require('@norjs/socket/src/interfaces/HttpClient.js');
require('../interfaces/DatabaseStorage.js');
require('../interfaces/databaseRequestTypes.js');

const _ = require('lodash');

/**
 *
 * @type {{get: string, create: string, update: string, list: string, delete: string}}
 */
const ROUTES = {

    /**
     * Path for `/create`
     */
    create: '/create',

    /**
     * Path for `/get`
     */
    get: '/get',

    /**
     * Path for `/list`
     */
    list: '/list',

    /**
     * Path for `/delete`
     */
    delete: '/delete',

    /**
     * Path for `/update`
     */
    update: '/update'

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
             * @returns {DatabaseResourceObject}
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
    getResource (where) {

        TypeUtils.assert(where, "DatabaseWhereObject");

        /**
         *
         * @type {DatabaseServiceGetRequestPayload}
         */
        const input = {
            where
        };

        return this[PRIVATE.client].postJson(
            ROUTES.get,
            {},
            {input}
        ).then(
            /**
             *
             * @param response {DatabaseServiceGetResponsePayload}
             * @returns {DatabaseResourceObject}
             */
            response => {
                TypeUtils.assert(response, "DatabaseServiceGetResponsePayload");
                return response.payload;
            }
        );

    }

    /**
     * Fetch multiple resources from the database.
     *
     * @param options {DatabaseListOptionsObject|undefined}
     * @returns {Promise.<DatabasePageObject>}
     */
    listResources (options = undefined) {

        TypeUtils.assert(options, "DatabaseListOptionsObject|{}|undefined");

        return this[PRIVATE.client].postJson(
            ROUTES.list,
            {},
            {
                input: options
            }
        ).then(
            /**
             *
             * @param response {DatabaseServiceListResponsePayload}
             * @returns {DatabasePageObject}
             */
            response => {
                TypeUtils.assert(response, "DatabaseServiceListResponsePayload");
                return response.payload;
            }
        );

    }

    /**
     * Update a resource in the database with new values from `object`.
     *
     * @param object {DatabaseResourceObject}
     * @param where {DatabaseWhereObject|undefined}
     * @returns {Promise.<DatabaseResourceObject>}
     */
    updateResource (object, where = undefined) {

        TypeUtils.assert(object, "DatabaseResourceObject");
        TypeUtils.assert(where, "DatabaseWhereObject|undefined");

        /**
         *
         * @type {DatabaseServiceUpdateRequestPayload}
         */
        const input = {
            where,
            payload: object
        };

        return this[PRIVATE.client].postJson(
            ROUTES.update,
            {},
            {input}
        ).then(
            /**
             *
             * @param response {DatabaseServiceUpdateResponsePayload}
             * @returns {DatabaseResourceObject}
             */
            response => {
                TypeUtils.assert(response, "DatabaseServiceUpdateResponsePayload");
                return response.payload;
            }
        );
    }

    /**
     * Delete a resource from the database.
     *
     * @param where {DatabaseWhereObject}
     * @returns {Promise.<DatabaseResourceObject>}
     */
    deleteResource (where) {

        TypeUtils.assert(where, "DatabaseWhereObject");

        /**
         *
         * @type {DatabaseServiceDeleteRequestPayload}
         */
        const input = {
            where
        };

        return this[PRIVATE.client].postJson(
            ROUTES.delete,
            {},
            {input}
        ).then(
            /**
             *
             * @param response {DatabaseServiceDeleteResponsePayload}
             * @returns {DatabaseResourceObject}
             */
            response => {
                TypeUtils.assert(response, "DatabaseServiceDeleteResponsePayload");
                return response.payload;
            }
        );

    }


}

TypeUtils.defineType("DatabaseHttpClient", TypeUtils.classToTestType(DatabaseHttpClient));

/**
 *
 * @type {typeof DatabaseHttpClient}
 */
module.exports = DatabaseHttpClient;
