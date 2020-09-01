const { errorResolver, successResolver } = require('../../../core/utils/resolvers');


module.exports.getAccessToken = (req, res) => {
    console.log(req.body);


    res.status(200).json({})
};


module.exports.getAuthorizationCode = (req, res) => {


    res.status(200).json({
    });
};


module.exports.createClient = (req, res, next) => {
    const crypto = require('crypto');
    const Client = require('../models/ClientModel');

    const SECRET = 'password';
    const ALGORITHM = 'sha256';

    const data = req.body.data;
    const hash = crypto.createHmac(ALGORITHM, SECRET).update(data).digest('base64');

    const newClient = {
        response_type: 'code',
        client_id: hash,
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
};
