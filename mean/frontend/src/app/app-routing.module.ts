import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { PasswordChangeComponent } from './components/password-change/password-change.component';
import { UserComponent } from './components/user/user.component';
import { AdminComponent } from './components/admin/admin.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AdminProfileComponent } from './components/admin-profile/admin-profile.component';
import { AuthGuard } from './route-guards/auth.guard';
import { UserGuard } from './route-guards/user.guard';
import { AdminGuard } from './route-guards/admin.guard';
import { AddRestaurantComponent } from './components/add-restaurant/add-restaurant.component';
import { ChangeRestaurantComponent } from './components/change-restaurant/change-restaurant.component';
import { RestaurantComponent } from './components/restaurant/restaurant.component';

const routes: Routes = [
  //rute dostupne korisniku koji nije logovan
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'password-change', component: PasswordChangeComponent},
  {path: '', component: LoginComponent},

  //sljedece rute su zasticene, pristup dozvoljen samo ako je korisnik logovan

  //rute za user-a
  {path: 'user', component: UserComponent, canActivate:[AuthGuard, UserGuard]},
  {path: 'user-profile/:username', component: UserProfileComponent, canActivate:[AuthGuard, UserGuard]},
  {path: 'restaurant/:restaurantKey', component: RestaurantComponent, canActivate:[AuthGuard, UserGuard]},

  //rute za admin-a
  {path: 'admin', component: AdminComponent, canActivate:[AuthGuard, AdminGuard]},
  {path: 'admin-profile/:username', component: AdminProfileComponent, canActivate:[AuthGuard, AdminGuard]},
  {path: 'add-restaurant', component: AddRestaurantComponent, canActivate:[AuthGuard, AdminGuard]},
  {path: 'change-restaurant/:restaurantKey', component: ChangeRestaurantComponent, canActivate:[AuthGuard, AdminGuard]}
]

@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forRoot(routes)
  ],
  providers: [AuthGuard, UserGuard, AdminGuard]
})

export class AppRoutingModule { }
