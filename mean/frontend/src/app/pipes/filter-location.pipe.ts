import { Pipe, PipeTransform } from '@angular/core';
import { Restaurant } from '../models/restaurant.model';

@Pipe({
  name: 'filterLocation'
})
export class FilterLocationPipe implements PipeTransform {

  transform(restaurants: Array<Restaurant>, trigger: number, selectedDistance: Number): any {
    //ako je selektovano All
    if(selectedDistance == 0){
      return restaurants;
    }

    console.log("selected Distance");
    console.log(selectedDistance);
    //ako je selektovana specificna distanca
    return restaurants.filter(function(restaurant){
      console.log(restaurant.distanceNumber);
      //console.log("filter");
      //pomocu indexOf funkcije gledamo da li u ovom nizu cuisineArray postoji kuhinje od ovog restorana
      return restaurant.distanceNumber <= selectedDistance;
    })



  }

}
