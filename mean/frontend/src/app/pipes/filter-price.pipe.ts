import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterPrice'
})
export class FilterPricePipe implements PipeTransform {

  transform(restaurants: any, trigger: number, priceArray?: any[]): any {
    //ako je prazan niz, tj nije selektovan specifican tip kuhinje
    //console.log(trigger);
    if(priceArray.length == 0){
      //console.log("niz je duzine 0");
      return restaurants;
    }

    //ako je selektovan neki tip kuhinje
    return restaurants.filter(function(restaurant){
      //console.log("filter");
      //pomocu indexOf funkcije gledamo da li u ovom nizu cuisineArray postoji kuhinje od ovog restorana
      return priceArray.indexOf(restaurant.category) != -1;
    })

  }

}
