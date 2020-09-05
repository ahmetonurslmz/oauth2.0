module.exports = {
    errorResolver(err, next) {
        try {
            const messages = [];
            let code = 400;
            if (err.code === 404) {
                code = 404;
                if (Object.prototype.hasOwnProperty.call(err, 'field')) {
                    messages.push({
                        [err.field]: `Couldn't find ${err.field}`,
                    });
                } else {
                    messages.push({
                        'not-found': `Couldn't find`,
                    });
                }
            } else if (err.code === 403) {
                code = 403;
                messages.push({
                    'forbidden': err.message,
                });
            } else if (Object.prototype.hasOwnProperty.call(err, 'errors')) {
                const errorObject = err.errors[Object.keys(err.errors)[0]];
                messages.push({
                    [errorObject.path]: `The ${errorObject.path} is ${errorObject.kind}`,
                });
            } else {
                const field = Object.keys(err.keyValue)[0];
                messages.push({
                    [field]: `The ${field} already added.`,
                })
            }

            const errorData = {
                code,
                result: {
                    messages,
                },
            };

            next(errorData);
        } catch (e) {
            next(e);
        }
    },

    successResolver(res, result) {
        res.status(200).json({
            status: true,
            code: 200,
            message: result.message,
            result: {
               data: result.data
            },
        });
    },

    validationResolver(err, next) {
        const messages = [];

        err.forEach(error => {
           if (!error.value) {
               messages.push({
                   [error.param]: `The ${error.param} is required`,
               });
           }
        });

        const errorData = {
            code: 400,
            result: {
                messages,
            },
        };
        next(errorData);
    }
};
