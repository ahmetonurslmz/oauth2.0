const mongoose = require('mongoose');

const collection = 'accounts';

const { Schema } = mongoose;

const ModelSchema = new Schema(
    {
        email: {
            required: true,
            unique: true,
            type: String,
        },
        password: {
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
    },
    { collection, versionKey: false }
);

const model = mongoose.model(collection, ModelSchema);
module.exports = model;
