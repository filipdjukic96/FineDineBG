"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
let Participation = new Schema({
    fairName: {
        type: String
    },
    username: {
        type: String
    },
    companyName: {
        type: String
    },
    participationCost: {
        type: Number
    },
    package: {
        type: String
    },
    accepted: {
        type: Boolean
    },
    comment: {
        type: String
    },
    timeSlot: {
        type: Array()
    },
});
exports.default = mongoose_1.default.model('Participation', Participation);
//# sourceMappingURL=participation.js.map