import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Restaurant } from '../models/restaurant.model';
import { Menu } from '../models/menu.model';
import { Review } from '../models/review.model';
import { ReviewItem } from '../models/reviewitem.model';
import { UserFavorites } from '../models/userfavorites.model';
import { RestaurantReservations } from '../models/restaurantreservations.model';
import { UserReservations } from '../models/userreservations.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  uri = 'http://localhost:4000'

  constructor(private http: HttpClient) { }

  
  getRestaurantData(restaurantKey: string) {
    return this.http.get<{ restaurant: Restaurant, menu: Menu, review:Review, restaurantReservations: RestaurantReservations }>(`${this.uri}/restaurantData/${restaurantKey}`);
  }

  addReview(data){
    return this.http.post<{ message: String }>(`${this.uri}/addReview`,data);
  }


  addFavorite(data){
    return this.http.post<{ message: String }>(`${this.uri}/addFavorite`,data);
  }

  deleteFavorite(data){
    return this.http.post<{ message: String }>(`${this.uri}/deleteFavorite`,data);
  }

  getFavorites(username:string){
    return this.http.get<{ userFavorites: UserFavorites }>(`${this.uri}/getFavorites/${username}`);
  }

  getReservations(username:string){
    return this.http.get<{ userReservations: UserReservations }>(`${this.uri}/getReservations/${username}`);
  }

  addReservation(data){
    return this.http.post<{ message: String }>(`${this.uri}/addReservation`,data);
  }


  deleteReservation(data){
    return this.http.post<{ message: String }>(`${this.uri}/deleteReservation`,data);
  }


  getAllRestaurants(){
    return this.http.get<{ restaurants: Array<Restaurant>, message: String }>(`${this.uri}/allRestaurants/`);
  }

  updateUserInfo(data){
    return this.http.post<{ message: String }>(`${this.uri}/updateUserInfo`,data);
  }

  changeProfilePicture(profilePicture: File, key: String){
    const postData = new FormData();

    postData.append("image", profilePicture, key.valueOf());//username predstavlja ime fajla tj slike

    return this.http.post<{ message: string }>(`${this.uri}/changeProfilePicture`, postData)
  }

}
