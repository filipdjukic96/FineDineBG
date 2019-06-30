"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const uniqueValidator = require("mongoose-unique-validator");
let UserReservations = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    reservations: {
        type: Array(),
        required: true
    },
});
UserReservations.plugin(uniqueValidator);
exports.default = mongoose_1.default.model('UserReservations', UserReservations);
//# sourceMappingURL=userreservations.js.map