import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Restaurant } from 'src/app/models/restaurant.model';
import { MapsService } from 'src/app/services/maps.service';


interface Location {
  lat: number;
  lng: number;
}


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {


  //za pretragu
  searchInput: String;

  //za filtere
  isCollapsedCuisine: Boolean = true;
  isCollapsedPrice: Boolean = true;
  isCollapsedRating: Boolean = true;
  isCollapsedMunicipality: Boolean = true;
  isCollapsedLocation: Boolean = true;
  //trigeri za filtere
  triggerCuisine: number = 1;
  triggerPrice: number = 1;
  triggerRating: number = 1;
  triggerMunicipality: number = 1;
  triggerLocation: number = 1;

  //za kuhinju
  cuisineFilters: Array<any> = null;
  cuisineFiltersArray: Array<any> = new Array<any>();
  //za cijenu
  priceFilters: Array<any> = null;
  priceFiltersArray: Array<any> = new Array<any>();

  //za rating
  ratingFilters: Array<any> = null;
  ratingFiltersArray: Array<any> = new Array<any>();
  ratingMinMaxGradeArray: Array<any> = new Array<any>();

  //za opstinu
  municipalityFilters: Array<any> = null;
  municipalityFiltersArray: Array<any> = new Array<any>();

  //za lokaciju
  locationFilters: Array<any> = null;
  locationFiltersArray: Array<any> = new Array<any>();
  selectedDistance: number = 0;
  distancesCalculated: Boolean;
  loading: boolean;

  //restorani
  restaurants: Array<Restaurant> = null;


  //za paginaciju
  p: number = 1;

  //za lokaciju korisnika
  lat: number;
  lng: number;
  location: Object;

  constructor(private router: Router, private authService: AuthService,
    private userService: UserService, formBuilder: FormBuilder,
    private gMapsService: MapsService,
    private __zone: NgZone,
    private ref: ChangeDetectorRef) {

    this.cuisineFilters = [
      { id: 1, itemName: "Serbian", isSelected: false },
      { id: 2, itemName: "Balkan", isSelected: false },
      { id: 3, itemName: "International", isSelected: false },
      { id: 4, itemName: "Latin American", isSelected: false },
      { id: 5, itemName: "Pan Asian", isSelected: false }
    ];

    this.priceFilters = [
      { id: 1, itemName: "Very expensive", value: 1, isSelected: false },
      { id: 2, itemName: "Expensive", value: 2, isSelected: false },
      { id: 3, itemName: "Standard", value: 3, isSelected: false },
      { id: 4, itemName: "Inexpensive", value: 4, isSelected: false }

    ];

    this.ratingFilters = [
      { id: 2, itemName: "Low rated", value: 1, isSelected: false }, //ocjena manja ili jednaka 4
      { id: 3, itemName: "Medium rated", value: 2, isSelected: false }, //ocjena izmedju 4 i 8, ekskluzivno
      { id: 4, itemName: "Top rated", value: 3, isSelected: false } //ocjena veca ili jednaka 8
    ];


    this.municipalityFilters = [
      { id: 0, itemName: "Stari grad", isSelected: false },
      { id: 1, itemName: "Savski venac", isSelected: false },
      { id: 2, itemName: "Vracar", isSelected: false },
      { id: 3, itemName: "Novi Beograd", isSelected: false },
      { id: 4, itemName: "Cukarica", isSelected: false },
      { id: 5, itemName: "Rakovica", isSelected: false },
      { id: 6, itemName: "Vozdovac", isSelected: false },
      { id: 7, itemName: "Zvezdara", isSelected: false },
      { id: 8, itemName: "Zemun", isSelected: false },
      { id: 9, itemName: "Palilula", isSelected: false },
      { id: 10, itemName: "Surcin", isSelected: false },
      { id: 11, itemName: "Obrenovac", isSelected: false },
      { id: 12, itemName: "Barajevo", isSelected: false },
      { id: 13, itemName: "Sopot", isSelected: false },
      { id: 14, itemName: "Grocka", isSelected: false },
      { id: 15, itemName: "Lazarevac", isSelected: false },
      { id: 16, itemName: "Mladenovac", isSelected: false }
    ];


    this.locationFilters = [
      { id: 0, itemName: "All", value: 0, isSelected: true },
      { id: 1, itemName: "Within 500m", value: 500, isSelected: false },
      { id: 2, itemName: "Within 1000m", value: 1000, isSelected: false },
      { id: 3, itemName: "Within 2000m", value: 2000, isSelected: false },
      { id: 4, itemName: "Within 3000m", value: 3000, isSelected: false }
    ];


  }

  ngOnInit() {

    //da nisu izracunate distance
    this.distancesCalculated = false;

    this.userService.getAllRestaurants().subscribe((result) => {
      //console.log(result.restaurants);
      this.restaurants = result.restaurants;
      console.log(this.restaurants);

      /*
      //trazenje lokacija korisnika
      this.gMapsService.getUserLocation().subscribe(data =>{
        console.log(data);
        this.lat = data.lat;
        this.lng = data.lng;
      })
      */
    })

  }


  restaurantCategory(category: number): number {
    return category - 1;
  }

  onChangeCuisine(event, item) {
    //console.log(event);
    //console.log(item);

    //ako je cekiran checkbox, dodaj u niz
    if (item.isSelected) {
      this.cuisineFiltersArray.push(item.itemName);
      this.triggerCuisine++;
      //console.log(this.cuisineFiltersArray);
      return;
    }

    //ako je odcekiran, izbaci iz niza
    if (!item.isSelected) {
      const index: number = this.cuisineFiltersArray.indexOf(item.itemName);
      if (index !== -1) {
        this.cuisineFiltersArray.splice(index, 1);
      }
      this.triggerCuisine--;
      //console.log(this.cuisineFiltersArray);
      return;
    }

  }

  onChangePrice(event, item) {
    //console.log(event);
    //console.log(item);


    //ako je cekiran checkbox, dodaj u niz
    if (item.isSelected) {
      this.priceFiltersArray.push(item.value);
      this.triggerPrice++;
      //console.log(this.priceFiltersArray);
      return;
    }

    //ako je odcekiran, izbaci iz niza
    if (!item.isSelected) {
      const index: number = this.priceFiltersArray.indexOf(item.value);
      if (index !== -1) {
        this.priceFiltersArray.splice(index, 1);
      }
      this.triggerPrice--;
      //console.log(this.priceFiltersArray);
      return;
    }


  }



  onChangeRating(event, item) {

    //ako je cekiran checkbox, dodaj u niz
    if (item.isSelected) {
      this.ratingFiltersArray.push(item.itemName);
      //console.log(this.ratingFiltersArray);
      this.calculateMinMaxGrade();
      this.triggerRating++;
      //console.log(this.cuisineFiltersArray);
      return;
    }

    //ako je odcekiran, izbaci iz niza
    if (!item.isSelected) {
      const index: number = this.ratingFiltersArray.indexOf(item.itemName);
      if (index !== -1) {
        this.ratingFiltersArray.splice(index, 1);
      }
      //console.log(this.ratingFiltersArray);
      this.calculateMinMaxGrade();
      this.triggerRating--;
      //console.log(this.cuisineFiltersArray);
      return;
    }
  }

  containsElement(array: Array<any>, item: String): boolean {
    const index: number = array.indexOf(item);
    if (index !== -1) {
      return true;
    }

    return false;
  }

  calculateMinMaxGrade() {

    this.ratingMinMaxGradeArray = [];

    if (this.ratingFiltersArray.length == 0) {
      for (let i = 0; i <= 10; i++) {
        this.ratingMinMaxGradeArray.push(i);
      }
      return;
    }

    const low = "Low rated";
    const med = "Medium rated";
    const top = "Top rated";

    if (this.containsElement(this.ratingFiltersArray, med)) {
      for (let i = 5; i <= 7; i++) {
        this.ratingMinMaxGradeArray.push(i);
      }

    }

    if (this.containsElement(this.ratingFiltersArray, low)) {
      for (let i = 0; i <= 4; i++) {
        this.ratingMinMaxGradeArray.push(i);
      }

    }


    if (this.containsElement(this.ratingFiltersArray, top)) {
      for (let i = 8; i <= 10; i++) {
        this.ratingMinMaxGradeArray.push(i);
      }
    }



    //console.log(this.ratingMinMaxGradeArray);
  }

  onChangeMunicipality(event, item) {
    //console.log(event);
    //console.log(item);

    //ako je cekiran checkbox, dodaj u niz
    if (item.isSelected) {
      this.municipalityFiltersArray.push(item.itemName);
      this.triggerMunicipality++;
      //console.log(this.municipalityFiltersArray);
      return;
    }

    //ako je odcekiran, izbaci iz niza
    if (!item.isSelected) {
      const index: number = this.municipalityFiltersArray.indexOf(item.itemName);
      if (index !== -1) {
        this.municipalityFiltersArray.splice(index, 1);
      }
      this.triggerMunicipality--;
      //console.log(this.municipalityFiltersArray);
      return;
    }


  }


  onChangeLocationDistance(event, item) {
    //console.log(event);
    //console.log(item);
    //console.log("selected distance");
    //console.log(this.selectedDistance);

    //ako nisu izracunate distance, izracunaj
    if (!this.distancesCalculated) {
      this.distancesCalculated = true;

      //racunanje distanci i na kraju promjena zeljene distance
      console.log("racunanje distanci");
      this.calculateDistances(item.value);

    } else {
      //izracuante distance, samo promjena zeljene distance
      this.selectedDistance = item.value;
      this.triggerLocation--;
      console.log('selected distance');
      console.log(this.selectedDistance);
      console.log("distance izracunate");
    }

  }


  calculateDistances(selectedDistance:number) {

    //priprema niza adresa svih restorana
    let addressArray = [];
    this.restaurants.forEach(element => {
      addressArray.push(element.address + ", Belgrade");
    });

    //console.log(addressArray);
    this.loading = true;
    this.gMapsService.calcDistance("Hadzi Ruvimova 21, Belgrade", addressArray)
      .subscribe((data: any) => {

        //console.log("DISTANCES");
        //console.log(data);

        this.loading = false;
        this.ref.detectChanges();

        //console.log(data);
        //console.log(data.rows[0].elements[0].distance.value);

        
        //upisivanje distanci i trajanja u restorane
        let i = 0;
        this.restaurants.forEach(element => {
          element.distanceString = data.result.rows[0].elements[i].distance.text;
          element.distanceNumber = data.result.rows[0].elements[i].distance.value;
          element.durationString = data.result.rows[0].elements[i].duration.text;

          ++i;
        });
        
        //mijenjanje selectedDistance koje trigeruje filter pipe
        this.selectedDistance = selectedDistance;
        this.triggerLocation++;
        console.log("selectedDistance");
        console.log(this.selectedDistance);
        //console.log("calc distances");
        //console.log(this.restaurants);
      }
      );

  }

}
