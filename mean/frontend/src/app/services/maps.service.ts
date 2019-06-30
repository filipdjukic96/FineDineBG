import { Injectable } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { of } from 'rxjs';
import { filter, catchError, tap, map, switchMap } from 'rxjs/operators';
import { from } from 'rxjs'
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface Location {
  lat: number;
  lng: number;
}


declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class MapsService {

  private geocoder: any;
  private distanceMatrixService: any;

  constructor(private http: HttpClient, private mapLoader: MapsAPILoader) { }

  private initGeocoder() {
    console.log('Init geocoder!');
    this.geocoder = new google.maps.Geocoder();
  }

  private initDistanceMatrixService() {
    console.log("Init DistanceMatrixService");
    this.distanceMatrixService = new google.maps.DistanceMatrixService();
  }

  private waitForMapsToLoad(): Observable<boolean> {
    if (!this.geocoder) {
      return from(this.mapLoader.load())
        .pipe(
          tap(() => this.initGeocoder()),
          map(() => true)
        );
    }
    return of(true);
  }

  private waitForMapsToLoad2(): Observable<boolean> {
    if (!this.distanceMatrixService) {
      return from(this.mapLoader.load())
        .pipe(
          tap(() => this.initDistanceMatrixService()),
          map(() => true)
        );
    }
    return of(true);
  }

  geocodeAddress(location: string): Observable<Location> {
    console.log('Start geocoding!');
    return this.waitForMapsToLoad().pipe(
      // filter(loaded => loaded),
      switchMap(() => {
        return new Observable(observer => {
          this.geocoder.geocode({ 'address': location }, (results, status) => {
            if (status == google.maps.GeocoderStatus.OK) {
              console.log('Geocoding complete!');
              //console.log(results[0].geometry.location);
              observer.next({
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng()
              });
            } else {
              console.log('Error - ', results, ' & Status - ', status);
              observer.next({ lat: 0, lng: 0 });
            }
            observer.complete();
          });
        })
      })
    )
  }


  //RADI!!!!!
  calcDistance(address1: String, addressArray: any): Observable<any> {
    console.log('Start calculation!');
    return this.waitForMapsToLoad2().pipe(
      // filter(loaded => loaded),
      switchMap(() => {
        return new Observable(observer => {
          this.distanceMatrixService.getDistanceMatrix({ 'origins': [address1], 
          'destinations': addressArray, travelMode: 'DRIVING' }, (results: any) => {
            //console.log('resultados distancia (mts) -- ', results.rows[0].elements[0].distance.value)
            console.log("result");
            console.log(results);
            observer.next({
              result: results
              //distance: results.rows[0].elements[0].distance.value, //distanca u metrima
              //duration: results.rows[0].elements[0].duration.value //trajanje u sekundama
            });
          });
        })
      })
    )
  }

}
