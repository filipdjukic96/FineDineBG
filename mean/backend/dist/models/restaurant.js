"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const uniqueValidator = require("mongoose-unique-validator");
let Restaurant = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    key: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    municipality: {
        type: String,
        required: true
    },
    workHoursWorkdays: {
        type: String,
        required: true
    },
    workHoursSaturday: {
        type: String,
        required: true
    },
    workHoursSunday: {
        type: String,
        required: true
    },
    cuisine: {
        type: String,
        required: true
    },
    dressCode: {
        type: String,
        required: true
    },
    paymentOptions: {
        type: Boolean,
        required: true
    },
    additional: {
        type: String,
        required: true
    },
    website: {
        type: String,
        required: true
    },
    contactPhone: {
        type: String,
        required: true
    },
    category: {
        type: Number,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    mainPicture: {
        type: String
    },
    coverPicture: {
        type: String,
    },
    pictures: {
        type: Array(),
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
    sumGrades: {
        type: Number,
        required: true
    },
    totalGrades: {
        type: Number,
        required: true
    },
    distanceString: {
        type: String
    },
    distanceNumber: {
        type: Number
    },
    durationString: {
        type: String
    }
});
Restaurant.plugin(uniqueValidator);
exports.default = mongoose_1.default.model('Restaurant', Restaurant);
//# sourceMappingURL=restaurant.js.map