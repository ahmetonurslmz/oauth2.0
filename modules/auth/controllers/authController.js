const { errorResolver, successResolver, validationResolver } = require('../../../core/utils/resolvers');
const { validationResult } = require('express-validator');
const Client = require('../models/ClientModel');

const { findOrThrow } = require('../../../core/utils/mongoInterrogator');


module.exports.getAccessToken = (req, res) => {
    console.log(req.body);


    res.status(200).json({})
};


module.exports.getAuthorizationCode = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        validationResolver(errors.array(), next);
    } else {
        const { client_id, response_type } = req.body;

        try {
            await Client.init();
            const requestedClient = await findOrThrow(Client, { _id: client_id, response_type }, 'client');

            if (req.hostname === 'localhost' || requestedClient.client_url === req.hostname) {
                const crypto = require('crypto');
                const SECRET = 'password';
                const ALGORITHM = 'sha256';
                const hash = crypto.createHmac(ALGORITHM, SECRET).update(Math.random().toString(36)).digest('base64');


                const AuthorizationCode = require('../models/AuthorizationCodeModel');

                await AuthorizationCode.init();

                const PERIOD_OF_VALIDITY = 10; //day
                const newAuthorizationCode = {
                    client_id,
                    code: hash,
                    expired_at: new Date(new Date().getTime()+(PERIOD_OF_VALIDITY*24*60*60*1000)),
                }

                try {
                    const { _doc } = await AuthorizationCode.create(newAuthorizationCode);
                    successResolver(res, {
                        data: _doc,
                        message: 'Authorization code generated!',
                    });
                } catch (e) {
                    errorResolver(e, next);
                }
            } else {
                const e = new Error();
                e.message = 'Invalid client!';
                e.code = 403;
                throw e;
            }
        } catch (e) {
            errorResolver(e, next);
        }
    }
};


module.exports.createClient = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        validationResolver(errors.array(), next);
    } else {

        const { client_url } = req.body;



        const newClient = {
            response_type: 'code',
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
