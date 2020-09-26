const mongoose = require('mongoose');

const collection = 'authorization_codes';

const { Schema } = mongoose;

const ModelSchema = new Schema(
    {
        client_id: {
            type: mongoose.ObjectId,
            required: true,
        },
        code: {
            type: String,
            unique: true,
            required: true,
        },
        expiry_date: {
            type: Date,
            required: true,
        },
        is_active: {
            type: Boolean,
            required: true,
            default: true,
        },
        created_at: {
            type: Date,
            default: new Date(),
        },
    },
    { collection, versionKey: false }
);

const model = mongoose.model(collection, ModelSchema);
module.exports = model;
