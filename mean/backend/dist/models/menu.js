"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const uniqueValidator = require("mongoose-unique-validator");
let Menu = new Schema({
    restaurantKey: {
        type: String,
        required: true,
        unique: true
    },
    appetizers: {
        type: Array(),
        required: true
    },
    mains: {
        type: Array(),
        required: true
    },
    desserts: {
        type: Array(),
        required: true
    },
    salads: {
        type: Array(),
        required: true
    },
    soups: {
        type: Array(),
        required: true
    },
    nonalcoholic: {
        type: Array(),
        required: true
    },
    alcoholic: {
        type: Array(),
        required: true
    },
    wines: {
        type: Array(),
        required: true
    }
});
Menu.plugin(uniqueValidator);
exports.default = mongoose_1.default.model('Menu', Menu);
//# sourceMappingURL=menu.js.map