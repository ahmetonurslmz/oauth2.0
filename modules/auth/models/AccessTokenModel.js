const mongoose = require('mongoose');

const collection = 'access_tokens';

const { Schema } = mongoose;

const ModelSchema = new Schema(
    {
        grant_type: {
            type: String,
            required: true,
        },
        expires_in: {
            type: Number,
            default: 36000,
        },
        client_id: {
            type: mongoose.ObjectId,
            required: true,
        },
        is_active: {
            type: Boolean,
            default: true,
        },
        access_token: {
            type: String,
            required: true,
        },
        refresh_token: {
            type: String,
            required: true,
        },
        token_type: {
            type: String,
            default: 'Bearer',
        },
        created_at: {
            type: Date,
            default: new Date(),
        },
        authorization_code_id: {
            type: mongoose.ObjectId,
            required: false,
        },
    },
    { collection, versionKey: false }
);

const model = mongoose.model(collection, ModelSchema);
module.exports = model;
