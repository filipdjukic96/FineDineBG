
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthGuard implements CanActivate {


    constructor(private service: AuthService, private router: Router){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        
        const isAuth = this.service.getAuthStatus();
        console.log("Auth guard "+isAuth);
        if(isAuth){ 
            return true;
        }else{
            this.router.navigate(['/login']);
        } 

    }

}