"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const uniqueValidator = require("mongoose-unique-validator");
let RestaurantReservations = new Schema({
    restaurantKey: {
        type: String,
        required: true,
        unique: true
    },
    numberOfReserved: {
        type: Number
    },
    reservations: {
        type: Array(),
        required: true
    },
});
RestaurantReservations.plugin(uniqueValidator);
exports.default = mongoose_1.default.model('RestaurantReservations', RestaurantReservations);
//# sourceMappingURL=restaurantreservations.js.map