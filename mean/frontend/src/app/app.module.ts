import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AppRoutingModule } from './app-routing.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { PasswordChangeComponent } from './components/password-change/password-change.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatStepperModule} from '@angular/material/stepper';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {RatingModule} from 'primeng/rating';
import {ColorPickerModule} from 'primeng/colorpicker';
import {SliderModule} from 'primeng/slider';
import { HeaderComponent } from './components/header/header.component';
import {FileUploadModule} from 'primeng/fileupload';
import {RadioButtonModule} from 'primeng/radiobutton';
import { AuthInterceptor } from './auth-interceptor';
import { UserComponent } from './components/user/user.component';
import { AdminComponent } from './components/admin/admin.component';
import { AuthService } from './services/auth.service';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AdminProfileComponent } from './components/admin-profile/admin-profile.component';
import { AddRestaurantComponent } from './components/add-restaurant/add-restaurant.component';
import { AdminService } from './services/admin.service';
import { DropdownModule } from 'primeng/dropdown';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ChangeRestaurantComponent } from './components/change-restaurant/change-restaurant.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { MatPaginatorModule } from '@angular/material';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RestaurantComponent } from './components/restaurant/restaurant.component';
import {GalleriaModule} from 'primeng/galleria';
import {CalendarModule} from 'primeng/calendar';
import {NgxPaginationModule} from 'ngx-pagination'; 
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { LightboxModule } from 'ngx-lightbox';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { FilterPipe } from './pipes/filter.pipe';
import { FilterCuisinePipe } from './pipes/filter-cuisine.pipe';
import { FilterPricePipe } from './pipes/filter-price.pipe';
import { FilterRatingPipe } from './pipes/filter-rating.pipe';
import { FilterMunicipalityPipe } from './pipes/filter-municipality.pipe';
import { AgmCoreModule, GoogleMapsAPIWrapper  } from '@agm/core';
import { UserService } from './services/user.service';
import { MapsService } from './services/maps.service';
import { FooterComponent } from './components/footer/footer.component';
import {MatRadioModule} from '@angular/material/radio';
import { FilterLocationPipe } from './pipes/filter-location.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    PasswordChangeComponent,
    HeaderComponent,
    UserComponent,
    AdminComponent,
    UserProfileComponent,
    AdminProfileComponent,
    AddRestaurantComponent,
    ChangeRestaurantComponent,
    RestaurantComponent,
    FilterPipe,
    FilterCuisinePipe,
    FilterPricePipe,
    FilterRatingPipe,
    FilterMunicipalityPipe,
    FooterComponent,
    FilterLocationPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    BrowserAnimationsModule,
    MatStepperModule,
    ButtonModule,
    InputTextModule,
    RatingModule,
    ColorPickerModule,
    SliderModule,
    FileUploadModule,
    RadioButtonModule,
    DropdownModule,
    ToggleButtonModule,
    AngularFontAwesomeModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    GalleriaModule,
    CalendarModule,
    NgxPaginationModule,
    MDBBootstrapModule.forRoot(),
    LightboxModule,
    MatCheckboxModule,
    MatRadioModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAXcf4H3cf0wE7xiEod-UE_5T7go5Y-tIg'
    })
  ],                        
  providers: [            //za interceptor za token
    AuthService,{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}, 
    AdminService, 
    UserService, 
    MapsService,
    GoogleMapsAPIWrapper
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
