import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string; //token koji se dobija prilikom login-a
  private tokenTimer: any;//timer koji mjeri vrijeme validnosti tokena
  private username: string;
  private type: string;


  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;
  

  uri = 'http://localhost:4000'

  constructor(private http: HttpClient, private router: Router) { }


  getToken() {
    return this.token;
  }

  getUsername(){
    return this.username;
  }

  getType(){
    return this.type;
  }

  getAuthStatus() {
    return this.isAuthenticated;
  }

  setToken(token: string, expiresIn: number, username: string, type: string) {
    this.token = token;
    this.username = username;
    this.type = type;

    if (token) {
      const expiresInDuration = expiresIn; 
      //postavljanje time-outa za token, nakon 1 sat korisnik se izloguje
      
      this.setAuthTimer(expiresInDuration);

      //postavljanje statusa autentikacije na true
      this.isAuthenticated = true;
      this.authStatusListener.next(true);
      const now = new Date();
      const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
     
      this.saveAuthData(token, expirationDate, username, type);
    }

  }


  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }


  logout() {

    this.token = null;
    this.username = null;
    this.type = null;

    this.isAuthenticated = false;
    this.authStatusListener.next(false);//push-ovanje nove vrijednosti
    //ponistavanje timer-a jer je bio manuelni logout
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/login']);
  }



  private setAuthTimer(duration: number){
    console.log("Setting time: "+duration)
    this.tokenTimer = setTimeout(()=>{
      //kad istekne expiresInDuration vrijeme poziva se logout funkcija
      this.logout();

    }, duration * 1000); // *1000 jer je argument u milisekundama, skloniti *1000 za demonstraciju 

  }

  autoAuthUser(){
    const authInformation = this.getAuthData();

    //ako nije token i expirationTime zapisan u localStorage-u tj korisnik se nije logovao, vracamo se
    if(!authInformation){
      return;
    }
    
    const now = new Date();

    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

    if(expiresIn > 0){
      this.token = authInformation.token;
      this.username = authInformation.username;
      this.type = authInformation.type;
      
      this.isAuthenticated = true; 
      this.setAuthTimer(expiresIn / 1000);//salje se u milisekundama
      this.authStatusListener.next(true);

    }
    
  }

  private saveAuthData(token: string, expirationDate: Date, username: string, type: string){
    localStorage.setItem("token",token);
    localStorage.setItem("expiration", expirationDate.toISOString());//mora se cuvati kao string
    localStorage.setItem("username",username);
    localStorage.setItem("type",type);
  }

  private clearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("username");
    localStorage.removeItem("type");
  }

  private getAuthData(){
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const username = localStorage.getItem("username");
    const type = localStorage.getItem("type");

    if(!token || !expirationDate){
      return;
    }

    return {
      token: token,
      expirationDate: new Date(expirationDate),
      username: username,
      type: type
    }

  }

//---------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------


  login(data) {
    return this.http.post<{ token: string, expiresIn: number, message: string, type: string; profilePicture: string }>(`${this.uri}/login`, data);
  }

  register(data: User, image: File) {
    const postData = new FormData();

    postData.append("image", image, data.username.valueOf());//username kao 3. parametar, predstavlja ime fajla tj slike

    postData.append("username", data.username.valueOf());
    postData.append("password", data.password.valueOf());
    postData.append("firstname", data.firstname.valueOf());
    postData.append("lastname", data.lastname.valueOf());
    postData.append("contactPhone", data.contactPhone.valueOf());
    postData.append("email", data.email.valueOf());
    postData.append("type", data.type.valueOf());
    postData.append("municipality", data.municipality.valueOf());
    postData.append("address", data.address.valueOf());
    postData.append("latitude", data.latitude.valueOf().toString());
    postData.append("longitude", data.longitude.valueOf().toString());
    postData.append("profilePicture", null);

    return this.http.post(`${this.uri}/register`, postData);
  }

  findUser(username: string) {
    return this.http.get(`${this.uri}/findUser/${username}`);
  }

  passwordChange(data) {
    return this.http.post<{ message: string }>(`${this.uri}/passwordChange`, data);
  }


}
