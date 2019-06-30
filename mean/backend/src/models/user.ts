import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

let User = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    contactPhone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    municipality: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    profilePicture: {
        type: String,
        required: true
    }
});

User.plugin(uniqueValidator);
export default mongoose.model('User', User);