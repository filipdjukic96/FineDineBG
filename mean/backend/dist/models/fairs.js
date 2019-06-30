"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
let Fairs = new Schema({
    Fairs: {
        type: Array()
    },
    Locations: {
        type: Array()
    }
});
exports.default = mongoose_1.default.model('Fairs', Fairs);
//# sourceMappingURL=fairs.js.map