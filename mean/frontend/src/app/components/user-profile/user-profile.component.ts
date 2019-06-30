import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserFavorites } from 'src/app/models/userfavorites.model';
import { UserReservations } from 'src/app/models/userreservations.model';
import { UserService } from 'src/app/services/user.service';
import { FavoriteItem } from 'src/app/models/favoriteitem.model';
import { ReservationItem } from 'src/app/models/reservationitem.model';
import { MapsService } from 'src/app/services/maps.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';


interface Location {
  lat: number;
  lng: number;
}


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {


  user: User = null;
  userFavorites: UserFavorites = null;
  userReservations: UserReservations = null;

  //za change info
  changeInfoForm: FormGroup;
  changeInfoMessage: String;
  //za potrebe dropdown-a
  municipalities: SelectItem[];
  //promjena slike
  imageUpload: File = null;
  imagePreview = null;
  imageMessage: String;

  //za mape i adresu
  address: String = "";
  zoom: number = 18;
  location: Location;
  loading: boolean;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private gMapsService: MapsService,
    private ref: ChangeDetectorRef,
    private formBuilder: FormBuilder) {

    this.changeInfoForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      contactPhone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      municipality: ['Stari grad', Validators.required],
      address: ['', Validators.required]
    })
  }

  ngOnInit() {

    //za opstine
    this.municipalities = [
      { value: 'Stari grad', label: 'Stari grad' },
      { value: 'Savski Venac', label: 'Savski Venac' },
      { value: 'Vracar', label: 'Vračar' },
      { value: 'Novi Beograd', label: 'Novi Beograd' },
      { value: 'Cukarica', label: 'Čukarica' },
      { value: 'Rakovica', label: 'Rakovica' },
      { value: 'Vozdovac', label: 'Voždovac' },
      { value: 'Zvezdara', label: 'Zvezdara' },
      { value: 'Zemun', label: 'Zemun' },
      { value: 'Palilula', label: 'Palilula' },
      { value: 'Surcin', label: 'Surčin' },
      { value: 'Obrenovac', label: 'Obrenovac' },
      { value: 'Barajevo', label: 'Barajevo' },
      { value: 'Sopot', label: 'Sopot' },
      { value: 'Grocka', label: 'Grocka' },
      { value: 'Lazarevac', label: 'Lazarevac' },
      { value: 'Mladenovac', label: 'Mladenovac' }
    ];



    let username = this.route.snapshot.paramMap.get("username");

    this.authService.findUser(username).subscribe((user: User) => {
      if (user) {
        this.user = user;
        console.log(this.user);
        //za formu

        this.changeInfoForm.controls.firstname.setValue(this.user.firstname);
        this.changeInfoForm.controls.lastname.setValue(this.user.lastname);
        this.changeInfoForm.controls.contactPhone.setValue(this.user.contactPhone);
        this.changeInfoForm.controls.email.setValue(this.user.email);
        this.changeInfoForm.controls.address.setValue(this.user.address);
        this.changeInfoForm.controls.municipality.setValue(this.user.municipality);


        this.userService.getFavorites(username).subscribe((result) => {
          this.userFavorites = result.userFavorites;

          this.userFavorites.favorites.forEach(element => {
            element.dateTime = new Date(element.dateTime);

          });



          this.userService.getReservations(username).subscribe((result) => {
            this.userReservations = result.userReservations;


            this.userReservations.reservations.forEach(element => {
              element.dateTime = new Date(element.dateTime);
              if (this.datePassed(element.dateTime)) {
                element.expired = true;
              }
            });

            console.log(this.userFavorites);
            console.log(this.userReservations);

          })

        })
      }
    })
  }


  onSubmit() {


    this.changeInfoMessage = "";


    if (this.changeInfoForm.invalid) {
      this.changeInfoMessage = "";



      //firstname
      if (this.changeInfoForm.controls.firstname.errors) {
        if (this.changeInfoForm.controls.firstname.errors.required) {
          this.changeInfoMessage = "Please enter first name";
          return;
        }
      }

      //lastname
      if (this.changeInfoForm.controls.lastname.errors) {
        if (this.changeInfoForm.controls.lastname.errors.required) {
          this.changeInfoMessage = "Please enter last name";
          return;
        }
      }





      //contactPhone
      if (this.changeInfoForm.controls.contactPhone.errors) {
        if (this.changeInfoForm.controls.contactPhone.errors.required) {
          this.changeInfoMessage = "Please enter contact phone";
          return;
        }
      }

      //address
      //contactPhone
      if (this.changeInfoForm.controls.address.errors) {
        if (this.changeInfoForm.controls.address.errors.required) {
          this.changeInfoMessage = "Please enter address";
          return;
        }
      }

      //email
      if (this.changeInfoForm.controls.email.errors) {
        if (this.changeInfoForm.controls.email.errors.required) {
          this.changeInfoMessage = "Please enter email";
          return;
        }
        if (this.changeInfoForm.controls.email.errors.email) {
          this.changeInfoMessage = "Incorrect email format";
          return;
        }
      }


    }


    //2 opcije, ako je mijenjana adresa onda moramo zvati gMaps, ako nije onda ne treba
    let latitude = this.user.latitude;
    let longitude = this.user.longitude;


    //ako je mijenjana adresa
    if (this.changeInfoForm.controls.address.value != this.user.address) {
      //mijenjana adresa
      console.log("mijenjana adresa");

      //mijenjana adresa, poziva se geocoder gMaps
      this.address = this.changeInfoForm.controls.address.value;

      this.loading = true;
      this.gMapsService.geocodeAddress(this.address + " Belgrade")
        .subscribe((location: Location) => {
          this.location = location;
          console.log("coordinates");
          console.log(this.location);
          latitude = this.location.lat;
          longitude = this.location.lng;
          this.loading = false;
          this.ref.detectChanges();

          //update-ovani su latitude i longitude
          //zovemo update profile
          this.updateUserInfo(latitude, longitude);

        }
        );

    } else {
      //nije mijenjana adresa
      console.log("nije mijenjana");
      this.updateUserInfo(latitude, longitude);

    }
  }


  updateUserInfo(latitude: Number, longitude: Number) {
    console.log("update user info");
    

    const data = {
      username: this.user.username,
      firstname: this.changeInfoForm.controls.firstname.value,
      lastname: this.changeInfoForm.controls.lastname.value,
      contactPhone: this.changeInfoForm.controls.contactPhone.value,
      email: this.changeInfoForm.controls.email.value,
      municipality: this.changeInfoForm.controls.municipality.value,
      address: this.changeInfoForm.controls.address.value,
      latitude: latitude,
      longitude: longitude
    }

    console.log(data);

    //prvo update podataka, a onda ako je mijenjana slika update-ovanje slike
    this.userService.updateUserInfo(data).subscribe((result)=>{
      console.log(result.message);

      //update-ovan info, mijenja se u user-u na frontendu
      this.user.firstname = data.firstname;
      this.user.lastname = data.lastname;
      this.user.contactPhone = data.contactPhone;
      this.user.email = data.email;
      this.user.municipality = data.municipality;
      this.user.address = data.address;
      this.user.latitude = data.latitude;
      this.user.longitude = data.longitude;


      //ako je promijenjena slika
      if(this.imageUpload != null){
        console.log("promijenjena slika");

        this.userService.changeProfilePicture(this.imageUpload, this.user.username).subscribe((result2)=>{
          console.log(result2.message);
        })
      }
    })



  }



  onImagePicked(event: Event) {
    console.log("Image picked");
    this.imageMessage = null;

    this.imageUpload = (event.target as HTMLInputElement).files[0];
    console.log(this.imageUpload);

    const reader = new FileReader();
    reader.onload = () => {

      this.imagePreview = reader.result;

      const x = new Image();

      x.src = reader.result as string;

      //za rezoluciju
      x.onload = () => {
        if (x.width > 300 || x.width < 100 || x.height > 300 || x.height < 100) {
          this.imageMessage = "Slika nije u dozvoljenoj rezoluciji!";
          this.imagePreview = null;
        }
      }

    };

    //citanje fajla
    reader.readAsDataURL(this.imageUpload);

  }

  deleteFavorite(favorite: FavoriteItem) {
    //console.log(favorite);

    const data = {
      username: this.user.username,
      restaurantName: favorite.restaurantName,
      restaurantKey: favorite.restaurantKey
    }

    this.userService.deleteFavorite(data).subscribe((result) => {
      //console.log(result.message);
      //izbacivanje elementa iz niza na frontendu da se odma prikaze
      const index: number = this.userFavorites.favorites.indexOf(favorite);
      if (index !== -1) {
        this.userFavorites.favorites.splice(index, 1);
      }

    })
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


  deleteReservation(reservation: ReservationItem) {
    console.log(reservation);

    const data = {
      username: this.user.username,
      restaurantName: reservation.restaurantName,
      restaurantKey: reservation.restaurantKey,
      dateTime: reservation.dateTime,
      numberOfPeople: reservation.numberOfPeople
    }

    this.userService.deleteReservation(data).subscribe((result) => {
      console.log(result.message);

      const index: number = this.userReservations.reservations.indexOf(reservation);
      if (index !== -1) {
        this.userReservations.reservations.splice(index, 1);
      }

    })

  }

}
