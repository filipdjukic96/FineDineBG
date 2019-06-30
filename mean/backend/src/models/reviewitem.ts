export interface ReviewItem{
    username: { 
        type: String
    },
    profilePicture: {
        type: String
    },
    grade: {
        type: Number
    },
    comment: {
        type: String
    },
    dateTime: {
        type: Date
    }
}