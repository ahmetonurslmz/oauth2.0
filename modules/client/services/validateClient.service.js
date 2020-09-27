const Client = require('../models/ClientModel');
const { findOrThrow } = require('../../../core/utils/mongoInterrogator');

const getDomain = (url) => {
    const getHostName = (url) => {
        const match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
        if (
            match != null &&
            match.length > 2 &&
            typeof match[2] === 'string' &&
            match[2].length > 0
        ) {
            return match[2];
        } else {
            return null;
        }
    };

    let hostName = getHostName(url);
    let domain = hostName;

    if (hostName != null) {
        const parts = hostName.split('.').reverse();

        if (parts != null && parts.length > 1) {
            domain = parts[1] + '.' + parts[0];

            if (
                hostName.toLowerCase().indexOf('.co.uk') !== -1 &&
                parts.length > 2
            ) {
                domain = parts[2] + '.' + domain;
            }
        }
    }
    return domain;
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
