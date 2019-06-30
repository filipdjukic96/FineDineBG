import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterCuisine'
})
export class FilterCuisinePipe implements PipeTransform {

  transform(restaurants: any, trigger: number, cuisineArray?: any[]): any {
    if(cuisineArray.length == 0){
      return restaurants;
    }

    return restaurants.filter(function(restaurant){
      return cuisineArray.indexOf(restaurant.cuisine) != -1;
    })
  }

}
