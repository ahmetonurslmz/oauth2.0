module.exports.findOrThrow = async (model, data, field) => {
    const result = await model['findOne'](data).exec();
    if (result) {
        return result._doc;
    } else {
        const e = new Error();
        e.message = 'Couldn\'t find data';
        if (model && model.collection && model.collection.name) {
            e.field = model.collection.name;
        } else if (field) {
            e.field = field;
        }
        e.code = 404;
        throw e;
    }
}
