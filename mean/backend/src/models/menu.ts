import mongoose from 'mongoose';
import {MenuItem} from './menuitem';

const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

let Menu = new Schema({
    restaurantKey: {
        type: String,
        required: true,
        unique: true
    },
    appetizers: {
        type: Array<MenuItem>(),
        required: true
    },
    mains: {
        type: Array<MenuItem>(),
        required: true
    },
    desserts: {
        type: Array<MenuItem>(),
        required: true
    },
    salads: {
        type: Array<MenuItem>(),
        required: true
    },
    soups: {
        type: Array<MenuItem>(),
        required: true
    },
    nonalcoholic: {
        type: Array<MenuItem>(),
        required: true
    },
    alcoholic: {
        type: Array<MenuItem>(),
        required: true
    },
    wines: {
        type: Array<MenuItem>(),
        required: true
    }
});

Menu.plugin(uniqueValidator);
export default mongoose.model('Menu', Menu);