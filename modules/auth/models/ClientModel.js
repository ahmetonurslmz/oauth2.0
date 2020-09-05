const mongoose = require('mongoose');

const collection = 'clients';

const { Schema } = mongoose;


const ModelSchema = new Schema({
    response_type: {
        required: true,
        type: String,
    },
    client_url: {
        type: String,
        unique: true,
        required: true,
    },
    is_active: {
        type: Boolean,
        default: true,
    },
    created_at: {
        type: Date,
        default: new Date(),
    },
}, { collection, versionKey: false });


const model = mongoose.model(collection, ModelSchema);
module.exports = model
