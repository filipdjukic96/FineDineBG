
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Injectable } from '@angular/core';

@Injectable()
export class UserGuard implements CanActivate {


    constructor(private service: AuthService, private router: Router){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        
        const type = this.service.getType();
        console.log("User guard "+type);
        if(type == "user"){
            return true;
        }else{
            this.service.logout();//mora se izlogovati prvo
            this.router.navigate(['/login']);
        } 

    }

}