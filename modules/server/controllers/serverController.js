const {
    errorResolver,
    successResolver,
    validationResolver,
} = require('../../../core/utils/resolvers');
const { validationResult } = require('express-validator');


module.exports.generateServerKeys = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        validationResolver(errors.array(), next);
    } else {
        if (req.body.server_key === process.env.SERVER_KEY) {
            const crypto = require('crypto');
            const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                modulusLength: 2048,
                publicKeyEncoding: {
                    type: 'spki',
                    format: 'pem',
                },
                privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'pem',
                },
            });

            const fs = require('fs');
            fs.writeFile('id_rsa_priv.pem', privateKey, 'utf8', function (err) {
                if (err) return console.log(err);
                console.log('id_rsa_priv.pem was generated.');
            });

            fs.writeFile('id_rsa_pub.pem', publicKey, 'utf8', function (err) {
                if (err) return console.log(err);
                console.log('id_rsa_pub.pem was generated');
            });

            successResolver(res, {
                message: 'Server keys generated!',
            });
        } else {
            const e = new Error();
            e.message = 'The key is invalid!';
            e.field = 'server_key';
            e.code = 400;
            errorResolver(e, next);
        }
    }
};
