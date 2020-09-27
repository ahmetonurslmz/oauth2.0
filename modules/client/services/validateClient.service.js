const Client = require('../models/ClientModel');
const { findOrThrow } = require('../../../core/utils/mongoInterrogator');

const getDomain = (url) => {
    let hostname = new URL(url).hostname;
    if (hostname.slice(0, 3) === 'www') {
        return hostname.slice(4, hostname.length);
    }
    return hostname;
};

const validateClient = async (req, clientId, responseType, data = {}) => {
    await Client.init();

    if (data && Object.prototype.hasOwnProperty.call(data, 'client_url')) {
        data.client_url = getDomain(data.client_url);
    }

    return findOrThrow(Client, {
        _id: clientId,
        is_active: true,
        response_type: responseType,
        ...data,
    });
};

module.exports = validateClient;
