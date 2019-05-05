# database

JSDoc Configurable Database Service

### Design

This is a simple document database service implementing a REST interface to a data over a UNIX socket file.
 
The data can be defined using JSDoc-style configuration files and our
 [TypeUtils](https://github.com/norjs/utils#typeutils).

### Usage

-------------------------------------------------------------------------------------

***Note!*** *This is just a draft usage; this application is not implemented yet.*

-------------------------------------------------------------------------------------

First define your custom data objects in a file named `./types.js`:

```js

const TypeUtils = require('@norjs/utils/Type');

/**
 * @typedef {Object} MyResourceItemDTO
 * @property {number} id - My resource id
 * @property {string} name - My resource name
 */
TypeUtils.defineType(
    "MyResourceItemDTO", 
    {
        "id": "number",
        "name": "string"
    }
);

/**
 * @typedef {Object} MyResourceDTO
 * @property {number} id - My resource id
 * @property {string} name - My resource name
 * @property {boolean} deleted - Deleted or not?
 * @property {Array.<MyResourceItemDTO>} items - My items
 */
TypeUtils.defineType(
    "MyResourceDTO", 
    {
        "id": "number",
        "name": "string",
        "deleted": "boolean",
        "items": "Array.<MyResourceItemDTO>"
    }
);

```

#### Start the service:

```
NOR_DATABASE_TYPES='./types.js' \
NOR_DATABASE_RESOURCES=MyResourceDTO \
NOR_DATABASE_STORE='./my-resources.json' \
NODE_LISTEN=./socket.sock \
npm start
```

#### Create a resource:

```
NODE_CONNECT=./socket.sock \
nor-database --create --set='{"id": 1, "name": "Foo"}'
```

#### Get a specific resource:

```
NODE_CONNECT=./socket.sock \
nor-database --get --where='{"id": 1}'
```

#### Get a list of resources:

```
NODE_CONNECT=./socket.sock \
nor-database --list
```

#### Get a list of resources by name:

```
NODE_CONNECT=./socket.sock \
nor-database --list --where='{"name": "Foo"}'
```

#### Update a resource:

```
NODE_CONNECT=./socket.sock \
nor-database --update --set='{"name": "Bar"}' --where='{"id": 1}'
```

#### Delete a resource:

```
NODE_CONNECT=./socket.sock \
nor-database --delete --where='{"id": 1}'
```
