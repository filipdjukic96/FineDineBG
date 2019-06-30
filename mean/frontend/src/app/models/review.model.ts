import { ReviewItem } from './reviewitem.model';

export interface Review{
    //bez imena restorana, jer treba da se ucita kao JSON
    restaurantKey: String,
    sumGrades: Number,
    totalGrades: Number,
    reviews: Array<ReviewItem>
}