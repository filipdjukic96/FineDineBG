"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const uniqueValidator = require("mongoose-unique-validator");
let Review = new Schema({
    restaurantKey: {
        type: String,
        required: true,
        unique: true
    },
    sumGrades: {
        type: Number,
        required: true
    },
    totalGrades: {
        type: Number,
        required: true
    },
    reviews: {
        type: Array(),
        required: true
    }
});
Review.plugin(uniqueValidator);
exports.default = mongoose_1.default.model('Review', Review);
//# sourceMappingURL=review.js.map