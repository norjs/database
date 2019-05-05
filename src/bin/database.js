#!/usr/bin/node
// nor-database

const _ = require('lodash');

/**
 *
 * @type {string}
 */
const VERBOSE_ARG = '--verbose';


/**
 * @type {string[]}
 */
const ARGS = process.argv.slice(2);

/**
 * @type {boolean}
 */
const VERBOSE = _.some(ARGS, arg => arg === VERBOSE_ARG);



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
    require('@norjs/socket/src/interfaces/HttpClientModule.js');

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
    const SocketHttpClient = require('@norjs/event/src/SocketHttpClient.js');

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