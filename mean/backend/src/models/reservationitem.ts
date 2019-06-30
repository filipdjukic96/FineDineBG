export interface ReservationItem{
    restaurantName: { 
        type: String
    },
    restaurantKey: {
        type: String
    },
    dateTime: { //datum kada je dodat u favorites
        type: Date
    },
    numberOfPeople: {
        type: Number
    },
    reservationTime: {
        type: String
    },
    username: {
        type: String
    },
    expired: {
        type: Boolean
    }
}