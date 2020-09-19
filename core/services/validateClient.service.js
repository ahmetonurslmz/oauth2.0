const Client = require('../../modules/auth/models/ClientModel');
const { findOrThrow } = require('../utils/mongoInterrogator');


const validateClient = async (req, clientId, responseType) => {
    await Client.init();
    const requestedClient = findOrThrow(Client, { _id: clientId, is_active: true, response_type: responseType });

    if (req.hostname === 'localhost' || requestedClient.client_url === req.hostname) {
        return requestedClient;
    }
    const e = new Error();
    e.message = 'Invalid client!';
    e.code = 403;
    throw e;
};

module.exports = validateClient;
