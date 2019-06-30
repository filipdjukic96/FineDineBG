import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(restaurants: any, term?: any): any { 
    //ako je search term nedefinisan, vrati sve
    if(term === undefined){
      return restaurants;
    }
    //ako nije, vrati filterisan niz
    return restaurants.filter(function(restaurant){
      return restaurant.name.toLowerCase().includes(term.toLowerCase()); 
    })
  }

}
