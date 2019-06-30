import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AdminService } from 'src/app/services/admin.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material';
import { Restaurant } from 'src/app/models/restaurant.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  //za pretragu
  searchInput: String;

  //za paginator
  p: number = 1;

  
  restaurants: Array<Restaurant> = new Array<Restaurant>();


  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService,
    private adminService: AdminService, formBuilder: FormBuilder) {


  }

  ngOnInit() {

    this.adminService.getRestaurants()//pocinjemo sa prvom stranicom (drugi argument)
      .subscribe((result) => {
        console.log(result.message);
        this.restaurants = result.restaurants;
        console.log(this.restaurants);
      })
  }



  restaurantCategory(category: number): number{
    return category - 1;
  }


}
