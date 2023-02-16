const { CloudantV1 } = require('@ibm-cloud/cloudant');
const { IamAuthenticator } = require('ibm-cloud-sdk-core');
/**
 * Get all documents in Cloudant database:
 * https://docs.cloudant.com/database.html#get-documents
 **/

/**
 * Query using a Cloudant Query index:
 * https://docs.cloudant.com/cloudant_query.html#finding-documents-using-an-index
 **/
function prepareQuery(params) {
    query = {
        query: {
            selector: {}
        }
    };
    if (params['state']) {
        return {
            query: {
                selector: {
                    state: params['state']
                }
            }
        };
    }
    if (params['id']) {
        return {
            query: {
                selector: {
                    id: params['id']
                }
            }
        };
    }
}

function main(params) {

    var cloudantOrError = getCloudantAccount(params);
    if (typeof cloudantOrError !== 'object') {
        return Promise.reject(cloudantOrError);
    }

    var cloudant = cloudantOrError;

    var dbName = params.dbname;
    var query = prepareQuery(params);
    //var query = params.query;

    if (!dbName) {
        return Promise.reject('dbname is required.');
    }
    if (!query) {
        return Promise.reject('query field is required.');
    }
    var cloudantDb = cloudant.use(dbName);

    var docId = message.docid || message.id;
    var params = {};

    var cloudantDb = cloudant.use(dbName);
    if (!dbName) {
        return Promise.reject('dbname is required.');
    }
    if (docId) {
        if (typeof message.params === 'object') {
            params = message.params;
        } else if (typeof message.params === 'string') {
            try {
                params = JSON.parse(message.params);
            } catch (e) {
                return Promise.reject('params field cannot be parsed. Ensure it is valid JSON.');
            }
        }

        return readDocument(cloudantDb, docId, params);
    }
    else if (query) {
        if (typeof params.query === 'object') {
            query = params.query;
        } else if (typeof params.query === 'string') {
            try {
                query = JSON.parse(params.query);
            } catch (e) {
                return Promise.reject('query field cannot be parsed. Ensure it is valid JSON.');
            }
        } else {
            return Promise.reject('query field is ' + (typeof query) + ' and should be an object or a JSON string.');
        }

        return queryIndex(cloudantDb, query);
    }
    
    return listAllDocuments(cloudantDb, params);
}



function readDocument(cloudantDb, docId, params) {
    return new Promise(function (resolve, reject) {
        cloudantDb.get(docId, params, function (error, response) {
            if (!error) {
                resolve(response);
            } else {
                // @cloudant/cloudant@3.0.2 returns statusCode at error.statusCode
                // @cloudant/cloudant@4.3.1 returns statusCode at error.response.statusCode
                // For @cloudant/cloudant@4.3.1 try to return an additional @cloudant/cloudant@3.0.2 compatible statusCode.
                // If there is no error.statusCode, yet, and there is an error.response object and there is an
                // error.response.statusCode then make this also available as error.statusCode.
                error.statusCode = (!error.statusCode && error.response && error.response.statusCode) || error.statusCode;

                console.error('Error: ', error);

                // Return a plain error object with strings only. Otherwise the serialize-error would explode
                // the response with to much detail for @cloudant/cloudant@4.3.1.
                reject(JSON.parse(JSON.stringify(error)));
            }
        });
    });
}

function queryIndex(cloudantDb, query) {
    return new Promise(function (resolve, reject) {
        cloudantDb.find(query, function (error, response) {
            if (!error) {
                resolve(response);
            } else {
                // @cloudant/cloudant@3.0.2 returns statusCode at error.statusCode
                // @cloudant/cloudant@4.3.1 returns statusCode at error.response.statusCode
                // For @cloudant/cloudant@4.3.1 try to return an additional @cloudant/cloudant@3.0.2 compatible statusCode.
                // If there is no error.statusCode, yet, and there is an error.response object and there is an
                // error.response.statusCode then make this also available as error.statusCode.
                error.statusCode = (!error.statusCode && error.response && error.response.statusCode) || error.statusCode;

                console.log('Error: ', error);

                // Return a plain error object with strings only. Otherwise the serialize-error would explode
                // the response with to much detail for @cloudant/cloudant@4.3.1.
                reject(JSON.parse(JSON.stringify(error)));
            }
        });
    });
}

function main(message) {

    var cloudantOrError = getCloudantAccount(message);
    if (typeof cloudantOrError !== 'object') {
        return Promise.reject(cloudantOrError);
    }
    var cloudant = cloudantOrError;

    var dbName = message.dbname;
    var params = {};

    if (!dbName) {
        return Promise.reject('dbname is required.');
    }
    var cloudantDb = cloudant.use(dbName);

    if (typeof message.params === 'object') {
        params = message.params;
    } else if (typeof message.params === 'string') {
        try {
            params = JSON.parse(message.params);
        } catch (e) {
            return Promise.reject('params field cannot be parsed. Ensure it is valid JSON.');
        }
    }

    return listAllDocuments(cloudantDb, params);
}

/**
 * List all documents.
 */
function listAllDocuments(cloudantDb, params) {
    return new Promise(function (resolve, reject) {
        cloudantDb.list(params, function (error, response) {
            if (!error) {
                resolve(response);
            } else {
                // @cloudant/cloudant@3.0.2 returns statusCode at error.statusCode
                // @cloudant/cloudant@4.3.1 returns statusCode at error.response.statusCode
                // For @cloudant/cloudant@4.3.1 try to return an additional @cloudant/cloudant@3.0.2 compatible statusCode.
                // If there is no error.statusCode, yet, and there is an error.response object and there is an
                // error.response.statusCode then make this also available as error.statusCode.
                error.statusCode = (!error.statusCode && error.response && error.response.statusCode) || error.statusCode;

                console.error('Error: ', error);

                // Return a plain error object with strings only. Otherwise the serialize-error would explode
                // the response with to much detail for @cloudant/cloudant@4.3.1.
                reject(JSON.parse(JSON.stringify(error)));
            }
        });
    });
}

function getCloudantAccount(params) {

    var Cloudant = require('@cloudant/cloudant');
    var cloudant;

    if (!params.iamApiKey && params.url) {
        cloudant = Cloudant(params.url);
    } else {
        checkForBXCreds(params);

        if (!params.host) {
            return 'Cloudant account host is required.';
        }

        if (!params.iamApiKey) {
            if (!params.username || !params.password) {
                return 'You must specify parameter/s of iamApiKey or username/password';
            }
        }

        var protocol = params.protocol || 'https';
        if (params.iamApiKey) {
            var dbURL = `${protocol}://${params.host}`;
            if (params.port) {
                dbURL += ':' + params.port;
            }
            cloudant = new Cloudant({
                url: dbURL,
                // Only pass iamTokenUrl when params.iamUrl is defined and not empty. Otherwise
                // we get 'Error: options.uri is a required argument' for @cloudant/cloudant@4.3.1.
                plugins: {
                    iamauth: {
                        iamApiKey: params.iamApiKey,
                        ...(params.iamUrl && {
                            iamTokenUrl: params.iamUrl
                        })
                    }
                }
            });
        } else {
            var url = `${protocol}://${params.username}:${params.password}@${params.host}`;
            if (params.port) {
                url += ':' + params.port;
            }
            cloudant = Cloudant(url);
        }
    }
    return cloudant;
}

function checkForBXCreds(params) {

    if (params.__bx_creds && (params.__bx_creds.cloudantnosqldb || params.__bx_creds.cloudantNoSQLDB)) {
        var cloudantCreds = params.__bx_creds.cloudantnosqldb || params.__bx_creds.cloudantNoSQLDB;

        if (!params.host) {
            params.host = cloudantCreds.host || (cloudantCreds.username + '.cloudant.com');
        }
        if (!params.iamApiKey && !cloudantCreds.apikey) {
            if (!params.username) {
                params.username = cloudantCreds.username;
            }
            if (!params.password) {
                params.password = cloudantCreds.password;
            }
        } else if (!params.iamApiKey) {
            params.iamApiKey = cloudantCreds.apikey;
        }
    }

}