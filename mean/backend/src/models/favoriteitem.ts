export interface FavoriteItem{
    restaurantName: { 
        type: String
    },
    restaurantKey: {
        type: String
    },
    restaurantAddress: {
        type: String
    },
    restaurantWebsite: {
        type: String
    },
    dateTime: { //datum kada je dodat u favorites
        type: Date
    }
}