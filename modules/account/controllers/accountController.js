const { errorResolver, successResolver, validationResolver } = require('../../../core/utils/resolvers');

const { validationResult } = require('express-validator');

const { findOrThrow } = require('../../../core/utils/mongoInterrogator');

// Models
const Account = require('../models/AccountModel');

// Packages
const bcrypt = require('bcryptjs');

module.exports.login = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        validationResolver(errors.array(), next);
    } else {
        try {

            const { email, password } = req.body;

            const Account = require('../models/AccountModel');
            await Account.init();

            const userData = await findOrThrow(Account, {
                email,
            });

            const result = bcrypt.compareSync(password, userData.password);
            if (result) {
                successResolver(res, {
                    data: {
                        email,
                    },
                    message: 'Account verified!',
                });
            } else {
                const e = new Error();
                e.field = 'accounts';
                e.code = 404;
                throw e;
            }
        } catch (e) {
            errorResolver(e, next);
        }
    }
};

module.exports.register = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        validationResolver(errors.array(), next);
    } else {
        try {
            const { email, password } = req.body;

            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);

            await Account.init();

            const newUser = {
                email,
                password: hash,
            };

            await Account.create(newUser);
            successResolver(res, {
                data: {
                    email,
                },
                message: 'Account created!',
            });
        } catch (e) {
            errorResolver(e, next);
        }
    }
}
