"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const uniqueValidator = require("mongoose-unique-validator");
let UserFavorites = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    favorites: {
        type: Array(),
        required: true
    },
});
UserFavorites.plugin(uniqueValidator);
exports.default = mongoose_1.default.model('UserFavorites', UserFavorites);
//# sourceMappingURL=userfavorites.js.map