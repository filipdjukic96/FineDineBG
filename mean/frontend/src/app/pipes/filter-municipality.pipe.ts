import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterMunicipality'
})
export class FilterMunicipalityPipe implements PipeTransform {

  transform(restaurants: any, trigger: number, municipalityArray?: any[]): any {
    //ako je prazan niz, tj nije selektovan specifican tip kuhinje
    //console.log(trigger);
    if(municipalityArray.length == 0){
      //console.log("niz je duzine 0");
      return restaurants;
    }

    //ako je selektovan neki tip kuhinje
    return restaurants.filter(function(restaurant){
      //console.log("filter");
      //pomocu indexOf funkcije gledamo da li u ovom nizu cuisineArray postoji kuhinje od ovog restorana
      return municipalityArray.indexOf(restaurant.municipality) != -1;
    })

  }

}
