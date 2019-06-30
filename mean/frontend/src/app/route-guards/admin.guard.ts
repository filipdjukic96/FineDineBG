
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AdminGuard implements CanActivate {


    constructor(private service: AuthService, private router: Router){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        
        const type = this.service.getType();
        console.log("Admin guard "+type);
        if(type == "admin"){
            return true;
        }else{
            this.service.logout(); //mora se izlogovati prvo
            this.router.navigate(['/login']);
        } 

    }

}