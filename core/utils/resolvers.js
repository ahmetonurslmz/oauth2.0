module.exports = {
    errorResolver(err, next) {
        try {
            const messages = [];
            if (Object.prototype.hasOwnProperty.call(err, 'errors') && err.errors.response_type) {
                const errorObject = err.errors.response_type;
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
                code: 400,
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
};
