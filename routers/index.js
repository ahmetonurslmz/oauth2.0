const auth = require('../modules/auth/routers');

module.exports = (app) => {
    app.use('/auth', auth);
};
