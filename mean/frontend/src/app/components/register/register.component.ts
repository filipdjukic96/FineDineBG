import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../models/user.model';
import { SelectItem } from 'primeng/api';
import { MapsService } from 'src/app/services/maps.service';


interface Location {
  lat: number;
  lng: number;
}


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  registerMessage: string;

  imageMessage: String;

  imageUpload: File = null;
  imagePreview = null;

  //za potrebe dropdown-a
  municipalities: SelectItem[];


  //za mape
  location: Location;
  loading: boolean;

  constructor(private service: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private gMapsService: MapsService,
    private ref: ChangeDetectorRef) {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15)]],
      type: ['user', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      contactPhone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      municipality: ['Stari grad', Validators.required],
      address: ['', Validators.required]
    })
  }

  ngOnInit() {

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

  }


  addressToCoordinates(address: string) {
    this.loading = true;
    this.gMapsService.geocodeAddress(address + " Belgrade")
      .subscribe((location: Location) => {
        this.location = location;
        console.log("coordinates");
        console.log(this.location);

        this.loading = false;
        this.ref.detectChanges();
      }
      );
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

  passwordFormatCheck(password: string) {
    let numUpper = 0;
    let numLower = 0;
    let numNumerics = 0;

    let i: number;

    for (i = 0; i < password.length; i++) {

      //da li je veliko slovo
      if (password.charAt(i) >= 'A' && password.charAt(i) <= 'Z') {
        numUpper++;
      }

      //da li je malo slovo
      if (password.charAt(i) >= 'a' && password.charAt(i) <= 'z') {
        numLower++;
      }

      if (password.charAt(i) >= '0' && password.charAt(i) <= '9') {
        numNumerics++;
      }
    }


    if (numUpper < 1) {

      console.log("upper");
      return false;
    }

    if (numLower < 2) {

      console.log("lower");

      return false;
    }

    if (numNumerics < 3) {
      console.log("numeric");
      return false;
    }

    return true;

  }



  checkUsername(username: string) {

    this.service.findUser(username).subscribe((user: User) => {
      console.log("Usao u subscribe za checkUsername");
      if (user) {

        this.registerMessage = "Username taken";

      } else {

        this.registerUser();
      }
    })

  }


  submit() {
    console.log("register");

    //console.log(this.registerForm.controls.password.errors);
    //provjera unijetih podataka
    this.registerMessage = "";


    if (this.registerForm.invalid) {
      this.registerMessage = "";



      //firstname
      if (this.registerForm.controls.firstname.errors) {
        if (this.registerForm.controls.firstname.errors.required) {
          this.registerMessage = "Please enter first name";
          return;
        }
      }

      //lastname
      if (this.registerForm.controls.lastname.errors) {
        if (this.registerForm.controls.lastname.errors.required) {
          this.registerMessage = "Please enter last name";
          return;
        }
      }


      //username
      if (this.registerForm.controls.username.errors) {
        if (this.registerForm.controls.username.errors.required) {
          this.registerMessage = "Please enter username";
          return;
        }
      }

      //password
      if (this.registerForm.controls.password.errors) {

        //console.log(this.registerForm.controls.password.errors);

        if (this.registerForm.controls.password.errors.required) {
          this.registerMessage = "Please enter password";
          return;
        }


        let length = this.registerForm.controls.password.value.length;
        if (length < 8) {
          this.registerMessage = "Password must have a minimum of 8 characters";
          return;
        } else if (length > 15) {
          this.registerMessage = "Password must have a maximum of 15 characters";
          return;
        }


        if (this.registerForm.controls.password.errors.minLength) {

          this.registerMessage = "Password must have a minimum of 8 characters";
          return;
        }

        if (this.registerForm.controls.password.errors.maxLength) {
          this.registerMessage = "Password must have a maximum of 15 characters";
          return;
        }

      }

      //password format
      if (!this.passwordFormatCheck(this.registerForm.controls.password.value)) {
        this.registerMessage = "Incorrect password format";
        return;
      }


      //contactPhone
      if (this.registerForm.controls.contactPhone.errors) {
        if (this.registerForm.controls.contactPhone.errors.required) {
          this.registerMessage = "Please enter contact phone";
          return;
        }
      }

      //address
       //contactPhone
       if (this.registerForm.controls.address.errors) {
        if (this.registerForm.controls.address.errors.required) {
          this.registerMessage = "Please enter address";
          return;
        }
      }

      //email
      if (this.registerForm.controls.email.errors) {
        if (this.registerForm.controls.email.errors.required) {
          this.registerMessage = "Please enter email";
          return;
        }
        if (this.registerForm.controls.email.errors.email) {
          this.registerMessage = "Incorrect email format";
          return;
        }
      }


    }

    //provjera da li vec postoji korisnik sa tim username-om
    let username = this.registerForm.controls.username.value;
    this.checkUsername(username)

  }



  registerUser() {

    let address = this.registerForm.controls.address.value + " Belgrade";

    const data: User = {
      firstname: this.registerForm.controls.firstname.value,
      lastname: this.registerForm.controls.lastname.value,
      type: "user",
      username: this.registerForm.controls.username.value,
      password: this.registerForm.controls.password.value,
      contactPhone: this.registerForm.controls.contactPhone.value,
      email: this.registerForm.controls.email.value,
      municipality: this.registerForm.controls.municipality.value,
      address: this.registerForm.controls.address.value,
      latitude: 0,
      longitude: 0,
      profilePicture: null
    }


    //pozivanje servisa za mape
    this.loading = true;
    this.gMapsService.geocodeAddress(address + " Belgrade")
      .subscribe((location: Location) => {
        this.location = location;
        console.log("coordinates");
        console.log(this.location);

        //upisivanje u data
        data.latitude = this.location.lat;
        data.longitude = this.location.lng;


        this.loading = false;
        this.ref.detectChanges();

        console.log(data);
        
        
        //poziv za upis u bazu
        this.service.register(data, this.imageUpload).subscribe((result) => {
          this.imagePreview = null;
          this.imageUpload = null;

          console.log("register: " + result);
          if (result) {
            this.router.navigate(['/login']);
          }
        })
        

      }
      );


  }

}
