const { errorResolver, successResolver, validationResolver } = require('../../../core/utils/resolvers');
const { validationResult } = require('express-validator');


module.exports.getAccessToken = (req, res) => {
    console.log(req.body);


    res.status(200).json({})
};


module.exports.getAuthorizationCode = (req, res) => {


    res.status(200).json({
    });
};


module.exports.createClient = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        validationResolver(errors.array(), next);
    } else {
        const crypto = require('crypto');
        const Client = require('../models/ClientModel');

        const { client_url } = req.body;

        const SECRET = 'password';
        const ALGORITHM = 'sha256';

        const hash = crypto.createHmac(ALGORITHM, SECRET).update(client_url).digest('base64');

        const newClient = {
            response_type: 'code',
            client_id: hash,
            client_url,
        };


        Client.init().then(() => {
            Client.create(newClient).then((success) => {
                successResolver(res, {
                    data: success,
                    message: 'Client created!',
                });
            }).catch((err) => {
                errorResolver(err, next);
            });
        });
    }
};
