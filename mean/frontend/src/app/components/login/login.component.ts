import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router'

import { User } from '../../models/user.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SliderModule } from 'primeng/slider';
import { routerNgProbeToken } from '@angular/router/src/router_module';
import { AuthService } from '../../services/auth.service';
import { MapsService } from 'src/app/services/maps.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {



  loginForm: FormGroup;
  authMessage: String = null;



  constructor(private router: Router,
    private service: AuthService,
    private formBuilder: FormBuilder,
    private gMapsService: MapsService) {

    this.loginForm = formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      type: ['user', Validators.required]
    })
  }

  ngOnInit() {
    
  }


  onSubmit() {

    if (this.loginForm.invalid) {
      this.authMessage = "";

      //username
      if (this.loginForm.controls.username.errors) {
        if (this.loginForm.controls.username.errors.required) {
          this.authMessage = "Please enter username";
          return;
        }
      }

      if (this.loginForm.controls.password.errors) {
        if (this.loginForm.controls.password.errors.required) {
          this.authMessage = "Please enter password";
          return;
        }
      }
    }




    let username = this.loginForm.controls.username.value;
    let password = this.loginForm.controls.password.value;
    let type = this.loginForm.controls.type.value;



    let data = {
      username: username,
      password: password,
      type: type
    }

    //console.log(data);

    this.service.login(data).subscribe(response => {
      //console.log(response);


      const message = response.message;

      if (message == "Auth complete") {
        const token = response.token;
        const expiresIn = response.expiresIn;
        const type = response.type;
        //dodavanje username-a i type-a tokenu, kako bi se moglo pratiti u AuthService zbog route guards-a i sl
        this.service.setToken(token, expiresIn, username, type);


        //console.log(type);
      }

      //console.log(message);

      this.authMessage = message;

      if (this.authMessage == "Auth complete") {
        this.authMessage = null;

        localStorage.removeItem("profilePicture");
        localStorage.setItem("profilePicture", response.profilePicture);

        //localStorage.setItem("username", username);
        //localStorage.setItem("type", type);

        if (type == "user") {
          this.router.navigate(['/user']);
        } else {
          this.router.navigate(['/admin']);
        }
      }
    });

  }

}
