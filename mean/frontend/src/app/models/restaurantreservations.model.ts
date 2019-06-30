import { ReservationItem } from './reservationitem.model';

export interface RestaurantReservations{
    restaurantKey:String,
    numberOfReserved: Number,
    reservations: Array<ReservationItem>
}