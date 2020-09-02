const mongoose = require('mongoose');

const collection = 'clients';

const { Schema } = mongoose;


const ClientSchema = new Schema({
    response_type: {
        required: true,
        type: String,
    },
    client_id: {
        type: String,
        unique: true,
        required: true,
    },
    client_url: {
        type: String,
        unique: true,
        required: true,
    },
}, { collection, versionKey: false });


const Client = mongoose.model(collection, ClientSchema);
module.exports = Client
