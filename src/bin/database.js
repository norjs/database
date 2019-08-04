#!/usr/bin/node
// nor-database

const _ = require('lodash');

// FIXME: Create a --help argument

/**
 *
 * @type {string}
 */
const VERBOSE_ARG = '--verbose';

/**
 *
 * @type {string}
 */
const CREATE_ARG = '--create';

/**
 *
 * @type {string}
 */
const GET_ARG = '--get';

/**
 *
 * @type {string}
 */
const LIST_ARG = '--list';

/**
 *
 * @type {string}
 */
const UPDATE_ARG = '--update';

/**
 *
 * @type {string}
 */
const DELETE_ARG = '--delete';

/**
 *
 * @type {string}
 */
const PAGE_ARG = '--page';

/**
 *
 * @type {string}
 */
const SIZE_ARG = '--size';

/**
 *
 * @type {string}
 */
const WHERE_ARG = '--where';

/**
 *
 * @type {string}
 */
const SET_ARG = '--set';

/**
 *
 * @type {{get: string, create: string, update: string, list: string, delete: string}}
 */
const ACTION_ARGS = {
    create: CREATE_ARG,
    get: GET_ARG,
    list: LIST_ARG,
    update: UPDATE_ARG,
    delete: DELETE_ARG
};

/**
 *
 * @type {{set: string, where: string}}
 */
const OPTION_ARGS = {
    where: WHERE_ARG,
    set: SET_ARG,
    page: PAGE_ARG,
    size: SIZE_ARG
};

/**
 *
 * @type {string[]}
 */
const IGNORE_ARGS = [
    VERBOSE_ARG
];

/**
 * @type {string[]}
 */
const ARGS = process.argv.slice(2);

/**
 * @type {boolean}
 */
const VERBOSE = _.some(ARGS, arg => arg === VERBOSE_ARG);

const ACTIONS = parseActionArguments(ARGS);

/**
 *
 * @type {typeof TypeUtils}
 */
const TypeUtils = require("@norjs/utils/Type");

/**
 *
 * @type {typeof LogicUtils}
 */
const LogicUtils = require('@norjs/utils/Logic');

LogicUtils.tryCatch( () => {

    // Interfaces
    require('@norjs/types/interfaces/HttpClientModule.js');

    /**
     *
     * @type {HttpClientModule}
     */
    const HTTP = require('http');

    /**
     *
     * @type {typeof DatabaseHttpClient}
     */
    const DatabaseHttpClient = require('../client/DatabaseHttpClient.js');

    /**
     *
     * @type {typeof SocketHttpClient}
     */
    const SocketHttpClient = require('@norjs/socket/src/SocketHttpClient.js');

    /**
     *
     * @type {string}
     */
    const NODE_CONNECT = process.env.NODE_CONNECT;

    if (!NODE_CONNECT) {
        throw new Error(`You need to specify socket file to connect to: NODE_CONNECT not defined`);
    }

    const socket = new SocketHttpClient({
        socket: NODE_CONNECT,
        httpModule: HTTP,
        queryStringModule: require('querystring')
    });

    const client = new DatabaseHttpClient(socket);

    /**
     * @type {Promise[]}
     */
    const promises = _.map(
        ACTIONS,

        /**
         *
         * @param action
         * @returns {Promise}
         */
        action => new Promise(
            (resolve, reject) => LogicUtils.tryCatch(

                () => {

                    // console.log(`ACTION: `, action);

                    switch (action.action) {

                        case "get": {
                            resolve(client.getResource(action.options.where));
                            break;
                        }

                        case "list": {

                            const options = {
                                page: action.options.page,
                                size: action.options.size,
                                where: action.options.where
                            };

                            resolve(client.listResources(options));
                            break;
                        }

                        case "create": {
                            resolve(client.createResource(action.options.set));
                            break;
                        }

                        case "update": {
                            resolve(client.updateResource(action.options.set, action.options.where));
                            break;
                        }

                        case "delete": {
                            resolve(client.deleteResource(action.options.where));
                            break;
                        }

                        default:
                            throw new TypeError(`Undefined action: "${action.action}"`);
                    }

                },
                err => reject(err)
            )
        )

    );

    return Promise.all(promises).catch(err => handleError(err)).then(
        results => {
            _.forEach(results, result => {
                console.log(JSON.stringify(result));
            });
        }
    );

}, err => handleError(err));

/**
 *
 * @param err
 */
function handleError (err) {

    console.error(`Exception: ${TypeUtils.stringify(err)}`);

    if (VERBOSE && err.stack) {
        console.error(err.stack);
    }

    process.exit(1);
}

/**
 *
 * @param ARGS
 */
function parseActionArguments (ARGS) {

    /**
     *
     * @type {Array.<{options: {}, action: string}>}
     */
    let parsedActions = [];

    /**
     *
     * @type {{options: {}, action: string}}
     */
    let current = {
        action: undefined,
        options: {}
    };

    const OPTIONS = _.keys(OPTION_ARGS).map(key => ({key, arg: OPTION_ARGS[key]}));
    const ACTIONS = _.keys(ACTION_ARGS).map(key => ({key, arg: ACTION_ARGS[key]}));

    _.forEach(ARGS, arg => {

        /**
         * @type {string}
         */
        let value = '';

        if (!arg) return;

        if (arg.substr(0, 2) !== '--') {
            // Only arguments like --key[=value] are accepted.
            return;
        }

        // Parse value
        if (_.indexOf(arg, '=') >= 0) {
            const i = _.indexOf(arg, '=');
            value = arg.substr(i + 1 );
            arg = arg.substr(0, i);
        }

        const fullArgPrefix = arg;
        arg = fullArgPrefix.substr(2);

        // Ignore some arguments
        if (IGNORE_ARGS.indexOf(fullArgPrefix) >= 0) return;

        // Parse options
        const option = _.find(
            OPTIONS,
            option => option.arg === fullArgPrefix
        );
        if (option) {
            current.options[option.key] = value;
            return;
        }

        // Parse action
        const action = _.find(
            ACTIONS,
            action => action.arg === fullArgPrefix
        );

        if (action) {

            if (value) throw new TypeError(`Actions should not have a value`);

            if (current.action) {
                parsedActions.push(current);
                current = {
                    action: undefined,
                    options: {}
                };
            }

            current.action = action.key;
            return;
        }

        throw new TypeError(`Unknown argument: "${fullArgPrefix}"`)

    });

    if (current.action) {
        parsedActions.push(current);
    }

    // Parse JSON strings
    _.forEach(parsedActions, action => {

        if (action.options.set) {
            action.options.set = JSON.parse(action.options.set);
        } else {
            action.options.set = undefined;
        }

        if (action.options.where) {
            action.options.where = JSON.parse(action.options.where);
        } else {
            action.options.where = undefined;
        }

        if (action.options.page) {
            action.options.page = parseInt(action.options.page, 10);
        } else {
            action.options.page = 0;
        }

        if (action.options.size) {
            action.options.size = parseInt(action.options.size, 10);
        } else {
            action.options.size = 10;
        }

    });

    return parsedActions;
}