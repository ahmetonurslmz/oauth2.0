module.exports.findOrThrow = async (model, data, field) => {
    const result = await model['findOne'](data).exec();
    if (result) {
        return result._doc;
    } else {
        const e = new Error();
        e.message = 'Couldn\'t find data';
        e.field = field;
        e.code = 404;
        throw e;
    }
}
