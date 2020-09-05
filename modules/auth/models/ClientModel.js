const mongoose = require('mongoose');

const collection = 'clients';

const { Schema } = mongoose;


const ClientSchema = new Schema({
    response_type: {
        required: true,
        type: String,
    },
    client_url: {
        type: String,
        unique: true,
        required: true,
    },
}, { collection, versionKey: false });


const model = mongoose.model(collection, ClientSchema);
module.exports = model
