import mongoose from 'mongoose';
import { ReservationItem } from './reservationitem';

const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

let RestaurantReservations = new Schema({
    restaurantKey: {
        type: String,
        required: true,
        unique: true
    },
    numberOfReserved: {
        type: Number
    },
    reservations: {
        type: Array<ReservationItem>(),
        required: true
    },
});

RestaurantReservations.plugin(uniqueValidator);
export default mongoose.model('RestaurantReservations', RestaurantReservations);