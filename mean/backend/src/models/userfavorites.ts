import mongoose from 'mongoose';
import { FavoriteItem } from './favoriteitem';

const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

let UserFavorites = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    favorites: {
        type: Array<FavoriteItem>(),
        required: true
    },
});

UserFavorites.plugin(uniqueValidator);
export default mongoose.model('UserFavorites', UserFavorites);