"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
let Application = new Schema({
    advertisementName: {
        type: String
    },
    username: {
        type: String
    },
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    uploadedCV: {
        type: Boolean
    },
    coverLetter: {
        type: String
    },
    accepted: {
        type: Boolean
    },
    startDate: {
        type: Date
    }
});
exports.default = mongoose_1.default.model('Application', Application);
//# sourceMappingURL=application.js.map