import mongoose from 'mongoose';
import { ReservationItem } from './reservationitem';

const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

let UserReservations = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    reservations: {
        type: Array<ReservationItem>(),
        required: true
    },
});

UserReservations.plugin(uniqueValidator);
export default mongoose.model('UserReservations', UserReservations);