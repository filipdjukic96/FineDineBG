"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
let Advertisement = new Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    type: {
        type: String
    },
    company: {
        type: String
    },
    dateTime: {
        type: Date
    },
    closed: {
        type: Boolean
    },
    applications: {
        type: Array()
    }
});
exports.default = mongoose_1.default.model('Advertisement', Advertisement);
//# sourceMappingURL=advertisement.js.map