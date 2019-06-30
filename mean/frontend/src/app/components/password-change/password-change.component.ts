import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.css']
})
export class PasswordChangeComponent implements OnInit {

  passwordChangeForm: FormGroup;
  passwordChangeMessage: String = null;

  constructor(private service: AuthService, private router: Router, private formBuilder: FormBuilder) {
    this.passwordChangeForm = formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      newPassword: ['', Validators.required]
    })
  }


  ngOnInit() {
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



  submit() {

    this.passwordChangeMessage = "";

    //provjera da li je sve unijeto 

    if (this.passwordChangeForm.invalid) {
      this.passwordChangeMessage = "";


      //username
      if (this.passwordChangeForm.controls.username.errors) {
        if (this.passwordChangeForm.controls.username.errors.required) {
          this.passwordChangeMessage = "Please enter username";
          return;
        }
      }

      //password
      if (this.passwordChangeForm.controls.password.errors) {
        //console.log(this.registerForm.controls.password.errors);
        if (this.passwordChangeForm.controls.password.errors.required) {
          this.passwordChangeMessage = "Please enter password";
          return;
        }

      }

      //password
      if (this.passwordChangeForm.controls.newPassword.errors) {
        //console.log(this.registerForm.controls.password.errors);
        if (this.passwordChangeForm.controls.newPassword.errors.required) {
          this.passwordChangeMessage = "Please enter new password";
          return;
        }

      }



    }


    //sve unijeto
    //password format
    if (!this.passwordFormatCheck(this.passwordChangeForm.controls.newPassword.value)) {
      this.passwordChangeMessage = "Incorrect format for new password";
      return;
    }

    //sve dobro unijeto, provjera da li postoji korisnik i da li je dobra stara sifra
    const data = {
      username: this.passwordChangeForm.controls.username.value,
      password: this.passwordChangeForm.controls.password.value,
      newPassword: this.passwordChangeForm.controls.newPassword.value
    }

    this.service.passwordChange(data).subscribe(result =>{

      const message = result.message;

      if(message == "Password changed"){
        this.router.navigate(['/login']);
      }else{
        this.passwordChangeMessage = message;
      }
    })

    




  }

}
