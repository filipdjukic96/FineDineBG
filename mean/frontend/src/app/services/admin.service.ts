import { Injectable } from '@angular/core';
import { Restaurant } from '../models/restaurant.model';
import { HttpClient } from '@angular/common/http';
import { Menu } from '../models/menu.model';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {


  uri = 'http://localhost:4000'

  constructor(private http: HttpClient) { }

 

  addRestaurant(restaurant: Restaurant, menu: Menu, mainImage: File,
    coverImage: File, otherImages: FileList, imagesNameArray: Array<String>) {

    console.log("add restaurant service");
    //priprema post data za slanje slika
    const postData = new FormData();

    postData.append("image", mainImage, restaurant.name.valueOf());//username kao 3. parametar, predstavlja ime fajla tj slike
    postData.append("image", coverImage, "cover-" + restaurant.name.valueOf());//username kao 3. parametar, predstavlja ime fajla tj slike

    for (let i = 0; i < otherImages.length; i++) {
      postData.append("image", otherImages[i], imagesNameArray[i].valueOf() + "-image-" + restaurant.name.valueOf());//username kao 3. parametar, predstavlja ime fajla tj slike
    }

    //da se zna za koji restoran
    postData.append("restaurant", restaurant.name.valueOf());




    console.log("calling server");
    //dodavanje restorana u bazu bez slika
    this.http.post<{ message: String }>(`${this.uri}/addRestaurant`, restaurant)
      .subscribe((response) => {
        console.log("subscribe over");
        console.log(response.message);
        if (response.message == "Success") {
          //uspjesno dodat restoran slanje slika
          console.log("Restaurant added success");

          //dodavanje menija
          const data = {
            restaurantKey: restaurant.key,
            appetizers: menu.appetizers,
            mains: menu.mains,
            desserts: menu.desserts,
            salads: menu.salads,
            soups: menu.soups,
            nonalcoholic: menu.nonalcoholic,
            alcoholic: menu.alcoholic,
            wines: menu.wines,
          }

          console.log(data);
          this.http.post<{ message: String }>(`${this.uri}/addMenu`, data)
            .subscribe((response) => {

              if (response.message == "Success") {

                //dodavanje slika
                console.log("Add menu success");

                this.http.post<{ message: string }>(`${this.uri}/addRestaurantImages`, postData)
                  .subscribe((result) => {
                    if (result.message == "Success") {
                      console.log("Add images success");
                    } else {
                      console.log("Add images failure");
                    }
                  })

              }


            })

        }

      });

  }


  getRestaurantInfo(restaurantKey: string) {
    return this.http.get<{ restaurant: Restaurant, menu: Menu, review: Review }>(`${this.uri}/restaurantInfo/${restaurantKey}`);
  }

  changeRestaurantInfo(data) {
    return this.http.post<{ message: String, restaurant: Restaurant }>(`${this.uri}/changeRestaurantInfo`, data);
  }

  changeRestaurantMenu(data) {
    return this.http.post<{ message: String }>(`${this.uri}/changeRestaurantMenu`, data);
  }

  changeCoverImage(coverImage: File, key: String) {
    const postData = new FormData();

    postData.append("image", coverImage, "cover-" + key);//username kao 3. parametar, predstavlja ime fajla tj slike

    return this.http.post<{ message: string }>(`${this.uri}/changeCoverImage`, postData)
  }

  changeMainImage(coverImage: File, key: String) {
    const postData = new FormData();

    postData.append("image", coverImage, key.valueOf());//username kao 3. parametar, predstavlja ime fajla tj slike

    return this.http.post<{ message: string }>(`${this.uri}/changeMainImage`, postData)
  }


  addMoreImages(images: FileList, imagesNameArray: Array<String>, restaurantKey: String) {

    const postData = new FormData();


    for (let i = 0; i < images.length; i++) {
      postData.append("image", images[i], imagesNameArray[i].valueOf() + "-image-" + restaurantKey.valueOf());//username kao 3. parametar, predstavlja ime fajla tj slike
    }

    //da se zna za koji restoran
    postData.append("restaurantKey", restaurantKey.valueOf());

    return this.http.post<{ message: String }>(`${this.uri}/addMoreImages`, postData);
  }


  deleteImage(data) {

    return this.http.post<{ message: String }>(`${this.uri}/deleteImage`, data);
  }


  deleteReview(data){
    return this.http.post<{ message: String }>(`${this.uri}/deleteReview`, data);
  }

  getRestaurants(){
    return this.http.get<{ message: String, restaurants: Array<Restaurant>}>(`${this.uri}/restaurants`);
  }

}
