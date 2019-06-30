import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
  


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'FineDineBG';

  constructor(private service: AuthService){}
  
  ngOnInit(){
    //posto se ova komponenta prva load-uje, u ngOnInit metodi tj kada se load-uje komponenta
    //pozvace se odgovarajuca metoda AuthService komponente
    //koja ce provjeriti da li je korisnik ulogovan

    this.service.autoAuthUser();

  }


}
