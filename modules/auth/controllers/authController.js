const { errorResolver, successResolver, validationResolver } = require('../../../core/utils/resolvers');
const { validationResult } = require('express-validator');
const Client = require('../models/ClientModel');

const { findOrThrow } = require('../../../core/utils/mongoInterrogator');


const HashGeneratorService = require('../../../core/services/hashGenerator.service');


/**
 * Works for only authorization code grant type
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.getAccessToken = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        validationResolver(errors.array(), next);
    } else {
        const { client_id, code, grant_type } = req.body;

        try {
            if (grant_type === 'authorization_code') {

                await Client.init();
                const requestedClient = await findOrThrow(Client, { _id: client_id, is_active: true });

                if (req.hostname === 'localhost' || requestedClient.client_url === req.hostname) {

                    const AuthorizationCode = require('../models/AuthorizationCodeModel');
                    await AuthorizationCode.init();

                    await findOrThrow(AuthorizationCode, {
                        code, client_id,
                        is_active: true,
                        expiry_date: { $gt: new Date() } // if expiry date is higher than now date.
                    })


                    const AccessToken = require('../models/AccessTokenModel');
                    await AccessToken.init();


                    const HashGeneratorServiceInstance = new HashGeneratorService();
                    const access_token = HashGeneratorServiceInstance.generate();
                    const refresh_token = HashGeneratorServiceInstance.generate();

                    const newAccessToken = {
                        grant_type,
                        client_id,
                        access_token,
                        refresh_token,
                    };

                    const { _doc } = await AccessToken.create(newAccessToken);


                    // disable authorization code
                    await AuthorizationCode.update({ is_active: false });

                    successResolver(res, {
                        data: _doc,
                        message: 'Access token generated!',
                    });
                } else {
                    const e = new Error();
                    e.message = 'Invalid client!';
                    e.code = 403;
                    throw e;
                }
            } else {
                const e = new Error();
                e.message = 'The grant type is not supported yet!';
                e.code = 403;
                throw e;
            }
        } catch (e) {
            errorResolver(e, next);
        }
    }
};


exports.getAuthorizationCode = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        validationResolver(errors.array(), next);
    } else {
        const { client_id, response_type } = req.body;

        try {
            await Client.init();
            const requestedClient = await findOrThrow(Client, { _id: client_id, response_type, is_active: true });

            if (req.hostname === 'localhost' || requestedClient.client_url === req.hostname) {

                const HashGeneratorServiceInstance = new HashGeneratorService();
                const hash = HashGeneratorServiceInstance.generate();


                const AuthorizationCode = require('../models/AuthorizationCodeModel');
                await AuthorizationCode.init();

                const PERIOD_OF_VALIDITY = 10; // minutes


                const expiry_date = new Date();
                expiry_date.setMinutes(expiry_date.getMinutes() + PERIOD_OF_VALIDITY);


                const newAuthorizationCode = {
                    client_id,
                    code: hash,
                    expiry_date,
                };

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
