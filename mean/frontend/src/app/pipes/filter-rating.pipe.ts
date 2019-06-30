import { Pipe, PipeTransform } from '@angular/core';
import { Restaurant } from '../models/restaurant.model';


@Pipe({
  name: 'filterRating'
})
export class FilterRatingPipe implements PipeTransform {

  maxGrade: number = 0;
  minGrade: number = 1;


  transform(restaurants: Array<Restaurant>, trigger: number, gradeArray: any[]): any {
    //ako je prazan niz, tj nije selektovan specifican tip kuhinje
    console.log(gradeArray);


    if(gradeArray.length == 0){
      return restaurants;
    }

    //ako je selektovan neki tip kuhinje
    return restaurants.filter(function (restaurant) {
    
      let grade = 0;
      let gradeTrunc = 0;
      //console.log("res sum "+restaurant.sumGrades);
      //console.log("res total "+restaurant.totalGrades);
      if (restaurant.totalGrades > 0) {
        grade = restaurant.sumGrades.valueOf() / restaurant.totalGrades.valueOf();
        grade = parseFloat(grade.toPrecision(2));
        //console.log("grade "+grade);
        gradeTrunc = Math.trunc(grade);
        //console.log("grade trunc" +gradeTrunc);
      }

      //console.log(gradeTrunc);

      return (gradeArray.indexOf(gradeTrunc) != -1);
    })

  }


}
