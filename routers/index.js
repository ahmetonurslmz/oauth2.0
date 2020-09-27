const auth = require('../modules/auth/routers');
const account = require('../modules/account/routers');
const client = require('../modules/client/routers');
const server = require('../modules/server/routers');

module.exports = (app) => {
    app.use('/oauth2/auth', auth);
    app.use('/oauth2/account', account);
    app.use('/oauth2/client', client);
    app.use('/server', server);
};
