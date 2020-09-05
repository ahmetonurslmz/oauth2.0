const mongoose = require('mongoose');
const { ObjectId } = require('mongoose');

const collection = 'authorization_code';

const { Schema } = mongoose;


const AuthorizationCodeSchema = new Schema({
    client_id: {
        type: ObjectId,
        required: true,
    },
    code: {
      type: String,
      unique: true,
      required: true,
    },
    expired_at: {
        type: Date,
        required: true,
    },
    is_active: {
        type: Boolean,
        required: true,
        default: true,
    },
}, { collection, versionKey: false });


const model = mongoose.model(collection, AuthorizationCodeSchema);
module.exports = model
