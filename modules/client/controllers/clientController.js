const {
    errorResolver,
    successResolver,
    validationResolver,
} = require('../../../core/utils/resolvers');

const { validationResult } = require('express-validator');

// Models
const Client = require('../models/ClientModel');

module.exports.createClient = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        validationResolver(errors.array(), next);
    } else {
        const { client_url } = req.body;

        const newClient = {
            response_type: req.body.response_type
                ? req.body.response_type
                : 'code',
            client_url,
        };

        try {
            await Client.init();
            const { _doc: data } = await Client.create(newClient);
            successResolver(res, {
                data,
                message: 'Client created!',
            });
        } catch (e) {
            errorResolver(e, next);
        }
    }
};
