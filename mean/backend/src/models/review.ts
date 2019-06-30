import mongoose from 'mongoose';
import { ReviewItem } from './reviewitem';

const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

let Review = new Schema({
    restaurantKey: {
        type: String,
        required: true,
        unique: true
    },
    sumGrades: { 
        type: Number,
        required: true
    },
    totalGrades: {
        type: Number,
        required: true
    },
    reviews: {
        type: Array<ReviewItem>(),
        required: true
    }
});

Review.plugin(uniqueValidator);
export default mongoose.model('Review', Review);