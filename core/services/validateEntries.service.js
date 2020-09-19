const validateEntries = (entries, req) => {
    const data = Array.isArray(entries) ? entries : [entries];

    data.forEach((entry) => {


        if (!(Object.prototype.hasOwnProperty.call(req.body, entry) && req.body[entry] && req.body[entry].trim())) {
            const err = new Error();
            err.field = entry;
            err.message = `Couldn't find ${entry}`;
            err.code = 404;
            throw err;
        }
    });

    return true;
};

module.exports = validateEntries;
