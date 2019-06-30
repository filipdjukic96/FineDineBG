"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
let CV = new Schema({
    username: {
        type: String
    },
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    address: {
        type: String
    },
    city: {
        type: String
    },
    postalCode: {
        type: String
    },
    country: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    typeOfApplication: {
        type: String
    },
    workExperience: {
        type: Array()
    },
    education: {
        type: Array()
    },
    motherTongue: {
        type: String
    },
    foreignLanguages: {
        type: String
    },
    communicationSkills: {
        type: String
    },
    organizationalSkills: {
        type: String
    },
    jobRelatedSkills: {
        type: String
    },
    digitalSkills: {
        type: String
    },
    numRevisions: {
        type: Number
    }
});
exports.default = mongoose_1.default.model('CV', CV);
//# sourceMappingURL=cv.js.map