import { ReservationItem } from './reservationitem.model';

export interface UserReservations{
    username:String,
    reservations: Array<ReservationItem>
}