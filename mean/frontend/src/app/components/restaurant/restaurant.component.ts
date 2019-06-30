import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Restaurant } from 'src/app/models/restaurant.model';
import { Menu } from 'src/app/models/menu.model';
import { UserService } from 'src/app/services/user.service';
import { Review } from 'src/app/models/review.model';
import { parse } from 'url';
import { SelectItem } from 'primeng/api';
import { ReviewItem } from 'src/app/models/reviewitem.model';
import { UserFavorites } from 'src/app/models/userfavorites.model';
import { RestaurantReservations } from 'src/app/models/restaurantreservations.model';
import { UserReservations } from 'src/app/models/userreservations.model';
import { ReservationItem } from 'src/app/models/reservationitem.model';
import { Lightbox } from 'ngx-lightbox';


@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.css']
})
export class RestaurantComponent implements OnInit {


  restaurant: Restaurant = null;
  menu: Menu = null;
  review: Review = null;
  restaurantReservations: RestaurantReservations = null;

  userFavorites: UserFavorites = null;
  userReservations: UserReservations = null;
  isFavorite: Boolean = false;

  grade: Number = null;
  pricingCategory: String = null;
  electronicPayment: String = null;

  images: any[];

  //za lightbox

  public _albums: Array<any> = [];


  //forma za rezervacije
  reservationForm: FormGroup;
  numPeopleOptions: SelectItem[];
  timeOptions: Array<SelectItem> = new Array<SelectItem>();
  reservationMessageError: String = null;
  reservationMessageSuccess: String = null;
  timeOptionDisabled: Boolean = false;

  //za ocjenu i komentar
  userRating: Number = 1;
  userComment: String = "";
  p: number = 1;


  //za google maps
  latitude: number = 51.678418;
  longitude: number = 7.809007;
  zoom: number = 18;


  //za vrijeme rada
  workTimeWorkdays: String;
  workTimeSaturday: String;
  workTimeSunday: String;

  constructor(private authService: AuthService, private router: Router,
    private userService: UserService, private adminService: AdminService, private formBuilder: FormBuilder,
    private route: ActivatedRoute, private _lightbox: Lightbox) {


    this.reservationForm = this.formBuilder.group({
      numPeople: [1, Validators.required],
      date: [new Date(), Validators.required],
      time: ['', Validators.required]
    })

  }

  ngOnInit() {

    //inicijalizacija za formu za rezervacije
    this.numPeopleOptions = [
      { value: 1, label: '1' },
      { value: 2, label: '2' },
      { value: 3, label: '3' },
      { value: 4, label: '4' },
      { value: 5, label: '5' },
      { value: 6, label: '6' },
      { value: 7, label: '7' },
      { value: 8, label: '8' },
      { value: 9, label: '9' },
      { value: 10, label: '10' },
      { value: 11, label: '11' },
      { value: 12, label: '12' },
      { value: 13, label: '13' },
      { value: 14, label: '14' },
      { value: 15, label: '15' }
    ];

    let currentDate = new Date();
    //console.log("current date");
    //console.log(currentDate);



    let restaurantKey = this.route.snapshot.paramMap.get("restaurantKey");

    this.userService.getRestaurantData(restaurantKey).subscribe((result) => {
      this.restaurant = result.restaurant;
      this.menu = result.menu;
      this.review = result.review;

      this.restaurantReservations = result.restaurantReservations;


      //za vrijeme rada
      this.workTimeWorkdays = this.restaurant.workHoursWorkdays;

      this.workTimeSaturday = "Closed";
      if(this.restaurant.workHoursSaturday != "none - none"){
        this.workTimeSaturday = this.restaurant.workHoursSaturday;
      }
      
      this.workTimeSunday = "Closed";
      if(this.restaurant.workHoursSunday != "none - none"){
        this.workTimeSunday = this.restaurant.workHoursSunday;
      }

      //format date
      this.restaurantReservations.reservations.forEach(element => {
        element.dateTime = new Date(element.dateTime);
        if (this.datePassed(element.dateTime)) {
          element.expired = true;
        }
      });

      //console.log("restaurant reservations after date format");
      //console.log(this.restaurantReservations.reservations);

      //console.log(this.restaurantReservations);

      this.calculateGrade();


      //racunanje pricing kategorije
      if (this.restaurant.category == 1) {
        this.pricingCategory = "Very expensive";
      } else if (this.restaurant.category == 2) {
        this.pricingCategory = "Expensive";
      } else if (this.restaurant.category == 3) {
        this.pricingCategory = "Standard";
      } else {
        this.pricingCategory = "Inexpensive";
      }

      //racunanje elektronskog placanja
      if (this.restaurant.paymentOptions == true) {
        this.electronicPayment = "Electronic payment";
      } else {
        this.electronicPayment = "Electronic payment";
      }



      //racunanje da se izabere vrijeme za rezervaciju

      let day = currentDate.getDay();

      this.parseWorkTimeByDay(day);



      //kontrola
      //console.logconsole.log(this.restaurant);
      //console.log(this.menu);
      //console.log(this.review);


      //ovdje treba pozvati da se dohvate review-s


      //dodavanje slika u galeriju
      this.images = [];
      let i = 1;
      this.restaurant.pictures.forEach(element => {
        this.images.push({ source: 'assets/img/' + element, title: 'Image ' + i });
        i++;
      });


      //za lightbox

      this.restaurant.pictures.forEach(element => {

        const src = "/assets/img/" + element;
        const caption = 'Image name: ' + element;
        const thumb = "/assets/img/" + element;;
        const album = {
          src: src,
          caption: caption,
          thumb: thumb
        };

        this._albums.push(album);

      });







      //dohvatanje svih omiljenih restorana ovog korisnika
      let username = this.authService.getUsername();

      this.userService.getFavorites(username).subscribe((result) => {
        this.userFavorites = result.userFavorites;
        //console.log(this.userFavorites);
        let item = this.userFavorites.favorites.filter(x => x.restaurantKey == this.restaurant.key);


        console.log("restaurant key");
        console.log(this.restaurant.key);
        console.log("item");
        console.log(item);

        if (item.length > 0) {
          this.isFavorite = true;
          //console.log("is favorite");
        }
        console.log("user favorites");
        console.log(this.userFavorites.favorites);


        this.userService.getReservations(username).subscribe((result) => {
          //console.log("server reservations");

          this.userReservations = result.userReservations;


          //format date
          this.userReservations.reservations.forEach(element => {
            element.dateTime = new Date(element.dateTime);
            if (this.datePassed(element.dateTime)) {
              element.expired = true;
            }
          });


          //this.getAddress();
          //console.log("user reservations");
          //console.log(this.userReservations.reservations);

        })

      })

    })


  }

  parseWorkTimeByDay(day: number) {

    //ako je subota
    if (day == 6) {

      //ako ne radi subotom
      if (this.restaurant.workHoursSaturday == "none - none") {
        //onemoguci izbor vremena
        this.timeOptionDisabled = true;
      } else {

        this.timeOptionDisabled = false;
        let startTime = this.restaurant.workHoursSaturday.split("-")[0].split(":")[0];
        let endTime = this.restaurant.workHoursSaturday.split("-")[1].split(":")[0].split(" ")[1];

        this.parseWorkTime(startTime, endTime);
      }

    } else if (day == 0) {

      //ako ne radi nedjeljom
      if (this.restaurant.workHoursSunday == "none - none") {
        this.timeOptionDisabled = true;
      } else {

        this.timeOptionDisabled = false;
        let startTime = this.restaurant.workHoursSunday.split("-")[0].split(":")[0];
        let endTime = this.restaurant.workHoursSunday.split("-")[1].split(":")[0].split(" ")[1];

        this.parseWorkTime(startTime, endTime);
      }



    } else {

      this.timeOptionDisabled = false;

      let startTime = this.restaurant.workHoursWorkdays.split("-")[0].split(":")[0];
      let endTime = this.restaurant.workHoursWorkdays.split("-")[1].split(":")[0].split(" ")[1];

      this.parseWorkTime(startTime, endTime);
    }

  }


  parseWorkTime(startTime, endTime) {

    let startTimeInt = parseInt(startTime);
    let endTimeInt = parseInt(endTime);

    let numHours = endTimeInt - startTimeInt;

    this.timeOptions = [];

    let numOptions = numHours;

    let currentOption = startTimeInt;

    for (let i = 0; i < numOptions; i++) {
      this.timeOptions.push({ value: currentOption.toString() + ":00", label: currentOption.toString() + ":00" });

      //da se podesi u formi
      if (i == 0) {
        this.reservationForm.controls.time.setValue(currentOption.toString() + ":00");
      }

      this.timeOptions.push({ value: currentOption.toString() + ":30", label: currentOption.toString() + ":30" });

      currentOption++;
    }
  }


  dateChanged(event){
    
    console.log("date changed");
    console.log(event);
    let dateTime = this.reservationForm.controls.date.value;

    let day = dateTime.getDay();
    console.log("day:"+day);
    this.parseWorkTimeByDay(day);
  }


  onChoseLocation(event) {
    console.log(event);
    this.latitude = event.coords.lat;
    this.longitude = event.coords.lng;
  }


  open(index: number): void {
    // open lightbox
    this._lightbox.open(this._albums, index);
  }

  close(): void {
    // close lightbox programmatically
    this._lightbox.close();
  }

  calculateGrade() {
    //racunanje ocjene, parsiranje da budu 2 znacajne cifre
    //console.log("sum grades");
    //console.log(this.review.sumGrades);
    //console.log("totalGrades");
    //console.log(this.review.totalGrades);
    if (this.review.totalGrades > 0) {
      this.grade = this.review.sumGrades.valueOf() / this.review.totalGrades.valueOf();
      this.grade = parseFloat(this.grade.toPrecision(2));
    } else {
      this.grade = 0;
    }

  }


  datePassed(dateTime: Date) {
    let currentDate = new Date();
    //ako je datum vec prosao

    //console.log("dateTime:" + dateTime);
    //console.log("currentDate:" + currentDate);

    if (currentDate.getFullYear() > dateTime.getFullYear()) {

      return true;
    } else if (currentDate.getFullYear() == dateTime.getFullYear() && currentDate.getMonth() > dateTime.getMonth()) {

      return true;
    } else if (currentDate.getFullYear() == dateTime.getFullYear() && currentDate.getMonth() == dateTime.getMonth() && currentDate.getDate() > dateTime.getDate()) {

      return true;
    }

    return false;

  }

  isSameDate(date1: Date, date2: Date) {
    if (date1.getFullYear() != date2.getFullYear()) {
      return false;
    } else if (date1.getMonth() != date2.getMonth()) {
      return false;
    } else if (date1.getDate() != date2.getDate()) {
      return false;
    }

    return true;
  }


  onSubmit() {


    this.reservationMessageError = "";
    this.reservationMessageSuccess = "";

    let dateTime = this.reservationForm.controls.date.value;
    let numOfPeople = this.reservationForm.controls.numPeople.value;
    let username = this.authService.getUsername();

    //console.log(this.restaurantReservations.reservations);
    console.log("current date");
    console.log(new Date());

    //ako je dostignut maksimum restorana, za taj datum
    let numOfReservedForDate = 0;
    this.restaurantReservations.reservations.forEach(element => {
      if (this.isSameDate(dateTime, element.dateTime)) {
        numOfReservedForDate += element.numberOfPeople.valueOf();
      }
    });

    if (this.restaurant.capacity < numOfReservedForDate + numOfPeople) {
      const seatsLeftForDate = this.restaurant.capacity.valueOf() - numOfReservedForDate;
      this.reservationMessageError = "Capacity insufficient, only " + seatsLeftForDate + " left for chosen date";
      return;
    }



    //ako postoji rezervacija istog datuma od istog clana odbija se
    let result = this.restaurantReservations.reservations.filter(
      x => x.dateTime.getFullYear() == dateTime.getFullYear()
        && x.dateTime.getMonth() == dateTime.getMonth()
        && x.dateTime.getDate() == dateTime.getDate()
        && x.username == username);
    if (result.length > 0) {
      this.reservationMessageError = "You already have a reservation on this date!";
      return;
    }


    //ako je datum prosao
    if (this.datePassed(dateTime)) {
      this.reservationMessageError = "Date invalid";
      return;
    }



    //za rezervaciju

    console.log("picked date");
    console.log(this.reservationForm.controls.date.value);


    const data: ReservationItem = {
      restaurantName: this.restaurant.name,
      restaurantKey: this.restaurant.key,
      dateTime: this.reservationForm.controls.date.value,
      numberOfPeople: this.reservationForm.controls.numPeople.value,
      reservationTime: this.reservationForm.controls.time.value,
      username: username,
      expired: false
    }



    this.userService.addReservation(data).subscribe((result) => {
      console.log(result.message);
      //dodavanje u nizove na frontendu
      this.userReservations.reservations.push(data);
      this.restaurantReservations.reservations.push(data);
      this.reservationMessageSuccess = "Reservation complete";
    })


  }


  postReview() {
    //za postavljanje komentara i ocjene
    //console.log(this.userRating);
    //console.log(this.userComment);

    if (this.userComment == "") {
      return;
    }


    const currentDate = new Date();

    const review: ReviewItem = {
      username: this.authService.getUsername(),
      profilePicture: localStorage.getItem("profilePicture"),
      grade: this.userRating,
      comment: this.userComment,
      dateTime: currentDate
    }

    console.log(currentDate);

    const data = {
      review: review,
      restaurantKey: this.restaurant.key
    }

    this.userService.addReview(data).subscribe((response) => {

      //console.log(response.message);

      //dodati u niz trenutni
      //da se prikaze odmah
      this.review.reviews.push(review);

      //na kraju, update-ovati u trenutnom review-u
      this.review.sumGrades = this.review.sumGrades.valueOf() + this.userRating.valueOf();
      this.review.totalGrades = this.review.totalGrades.valueOf() + 1;

      //ponovo izracunati ocjenu
      this.calculateGrade();


      //na kraju, resetovati
      //mora unutar subscribe
      this.userRating = 1;
      this.userComment = "";


    })

  }

  addDeleteFavorite() {

    if (!this.isFavorite) { //nije u favorites, dodaj

      //console.log("add to favorites");

      const data = {
        restaurantName: this.restaurant.name,
        restaurantKey: this.restaurant.key,
        restaurantAddress: this.restaurant.address,
        restaurantWebsite: this.restaurant.website,
        username: this.authService.getUsername()
      }

      //console.log(data);

      this.userService.addFavorite(data).subscribe((result) => {
        //console.log(result.message);
        this.isFavorite = true;
      })
    } else { //u favorites je, ukloni

      const data = {
        username: this.authService.getUsername(),
        restaurantKey: this.restaurant.key,
        restaurantName: this.restaurant.name
      }

      this.userService.deleteFavorite(data).subscribe((result) => {
        //console.log(result.message);
        this.isFavorite = false;
      })

    }


  }

}
