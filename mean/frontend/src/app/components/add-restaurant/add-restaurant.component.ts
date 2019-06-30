import { Component, OnInit, ElementRef, ViewChild, NgZone, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AdminService } from 'src/app/services/admin.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Menu } from 'src/app/models/menu.model';
import { SelectItem } from 'primeng/api';
import { Restaurant } from 'src/app/models/restaurant.model';
import { MapsService } from 'src/app/services/maps.service';

interface Location {
  lat: number; 
  lng: number;
}

@Component({
  selector: 'app-add-restaurant',
  templateUrl: './add-restaurant.component.html',
  styleUrls: ['./add-restaurant.component.css']
})

export class AddRestaurantComponent implements OnInit {

  message: String = null;
  jsonMessage: String = null;

  //za prvi dio steppera
  restaurantForm: FormGroup;
  municipalities: SelectItem[];
  workHoursFrom: SelectItem[];
  workHoursTo: SelectItem[];
  cuisine: SelectItem[];
  dressCode: SelectItem[];
  pricingCategory: SelectItem[];

  sliderValue: number = 1;


  //za drugi dio steppera
  menu: Menu = null;
  inputFile: File = null;

  //za treci dio steppera

  //za glavnu sliku
  imageUploadMain: File = null;
  imagePreviewMain = null;
  imageMainName: String = "";

  //za cover sliku
  imageUploadCover: File = null;
  imagePreviewCover = null;
  imageCoverName: String = "";

  //za ostale slike
  imagesUpload: FileList = null;
  imagesPreview: Array<any> = new Array<any>();
  imagesName: String = "";
  imagesNameArray: Array<String> = new Array<String>();


  //za cetvrti dio steppera (Overview)
  restaurant: Restaurant;



  //za mape
  location: Location;
  loading: boolean;

  constructor(private router: Router, private authService: AuthService, 
    private adminService: AdminService, 
    private formBuilder: FormBuilder, 
    private gMapsService: MapsService, 
    private __zone: NgZone,
    private ref: ChangeDetectorRef) {

    this.restaurantForm = this.formBuilder.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      municipality: ['Stari grad', Validators.required],
      workHoursStartWorkdays: ['08:00', Validators.required],
      workHoursEndWorkdays: ['20:00', Validators.required],
      workHoursStartSaturday: ['08:00', Validators.required],
      workHoursEndSaturday: ['20:00', Validators.required],
      workHoursStartSunday: ['08:00', Validators.required],
      workHoursEndSunday: ['20:00', Validators.required],
      cuisine: ['Serbian', Validators.required],
      dressCode: ['Casual', Validators.required],
      paymentOptions: [false, Validators.required],
      additional: ['',],
      website: ['', Validators.required],
      contactPhone: ['', Validators.required],
      category: [1, Validators.required],
      capacity: [1, Validators.required],
      description: ['', Validators.required]
    })

  }

  ngOnInit() {

    //inicijalizacija objekta da bi se mogao kasnije manipulisati
    this.restaurant = {
      name: null,
      key: null,
      address: null,
      municipality: null,
      workHoursWorkdays: null,
      workHoursSaturday: null,
      workHoursSunday: null,
      cuisine: null,
      dressCode: null,
      paymentOptions: null,
      additional: null,
      website: null,
      contactPhone: null,
      category: null,
      capacity: null,
      description: null,
      mainPicture: null,
      coverPicture: null,
      pictures: new Array<String>(),
      latitude: null,
      longitude: null,
      sumGrades: null,
      totalGrades: null,
      distanceNumber: 0,
      distanceString: null,
      durationString: null
    };

    this.municipalities= [
      {value: 'Stari grad',label: 'Stari grad'},
      {value: 'Savski venac',label: 'Savski venac'},
      {value: 'Vracar',label: 'Vračar'},
      {value: 'Novi Beograd',label: 'Novi Beograd'},
      {value: 'Cukarica',label: 'Čukarica'},
      {value: 'Rakovica',label: 'Rakovica'},
      {value: 'Vozdovac',label: 'Voždovac'},
      {value: 'Zvezdara',label: 'Zvezdara'},
      {value: 'Zemun',label: 'Zemun'},
      {value: 'Palilula',label: 'Palilula'},
      {value: 'Surcin',label: 'Surčin'},
      {value: 'Obrenovac',label: 'Obrenovac'},
      {value: 'Barajevo',label: 'Barajevo'},
      {value: 'Sopot',label: 'Sopot'},
      {value: 'Grocka',label: 'Grocka'},
      {value: 'Lazarevac',label: 'Lazarevac'},
      {value: 'Mladenovac',label: 'Mladenovac'}
    ];

    this.workHoursFrom = [
      { value: 'none', label: 'none' },
      { value: '08:00', label: '08:00' },
      { value: '09:00', label: '09:00' },
      { value: '10:00', label: '10:00' },
      { value: '11:00', label: '11:00' }

    ];

    this.workHoursTo = [
      { value: 'none', label: 'none' },
      { value: '20:00', label: '20:00' },
      { value: '21:00', label: '21:00' },
      { value: '22:00', label: '22:00' },
      { value: '23:00', label: '23:00' },
      { value: '24:00', label: '24:00' },
      { value: '01:00', label: '01:00' },
      { value: '02:00', label: '02:00' }
    ];


    this.cuisine = [
      { value: 'Serbian', label: 'Serbian' },
      { value: 'Balkan', label: 'Balkan' },
      { value: 'International', label: 'International' },
      { value: 'Latin American', label: 'Latin American' },
      { value: 'Pan Asian', label: 'Pan Asian' }
    ];

    this.dressCode = [
      { value: 'Casual', label: 'Casual' },
      { value: 'Business', label: 'Business' }
    ];


    this.pricingCategory = [
      { value: 1, label: 'Very expensive' },
      { value: 2, label: 'Expensive' },
      { value: 3, label: 'Standard' },
      { value: 4, label: 'Inexpensive' }
    ];

  }


  onSubmit() {

    this.message = "";

    if (this.restaurantForm.invalid) {
      this.message = "Please enter all data";
      return;
    }


    let name = this.restaurantForm.controls.name.value;

    let key = name.toLowerCase().split(' ').join('-');


    this.restaurant.name = name;
    this.restaurant.key = key;
    this.restaurant.address = this.restaurantForm.controls.address.value;
    this.restaurant.municipality = this.restaurantForm.controls.municipality.value;
    this.restaurant.workHoursWorkdays = this.restaurantForm.controls.workHoursStartWorkdays.value + " - " + this.restaurantForm.controls.workHoursEndWorkdays.value;
    this.restaurant.workHoursSaturday = this.restaurantForm.controls.workHoursStartSaturday.value + " - " + this.restaurantForm.controls.workHoursEndSaturday.value;
    this.restaurant.workHoursSunday = this.restaurantForm.controls.workHoursStartSunday.value + " - " + this.restaurantForm.controls.workHoursEndSunday.value;
    this.restaurant.cuisine = this.restaurantForm.controls.cuisine.value;
    this.restaurant.dressCode = this.restaurantForm.controls.dressCode.value;
    this.restaurant.paymentOptions = this.restaurantForm.controls.paymentOptions.value;
    this.restaurant.additional = this.restaurantForm.controls.additional.value;
    this.restaurant.website = this.restaurantForm.controls.website.value;
    this.restaurant.contactPhone = this.restaurantForm.controls.contactPhone.value;
    this.restaurant.category = this.restaurantForm.controls.category.value;
    this.restaurant.capacity = this.restaurantForm.controls.capacity.value;
    this.restaurant.description = this.restaurantForm.controls.description.value;
     //pictures ne diramo
    this.restaurant.mainPicture = null;
    this.restaurant.coverPicture = null;
    //stavljamo 0 na sume
    this.restaurant.sumGrades = 0;
    this.restaurant.totalGrades = 0;
    //console.log(this.restaurant);
    //racunanje kooridnata, tj latitude i longitude na osnovu adrese
    this.addressToCoordinates();
  }



  addressToCoordinates() {
    this.loading = true;
    this.gMapsService.geocodeAddress(this.restaurant.address.valueOf() + " Belgrade")
    .subscribe((location: Location) => {
        this.location = location;
        console.log("coordinates");
        console.log(this.location);
        this.restaurant.latitude = this.location.lat;
        this.restaurant.longitude = this.location.lng;
        this.loading = false;
        this.ref.detectChanges();  
      }      
    );     
  }


  handleSliderChange(event) {
    this.sliderValue = event.value;
  }

  addJSONFile(event) {
    this.message = "";
    this.jsonMessage = "";


    this.inputFile = <File>event.target.files[0];
    let r = new FileReader();

    r.onload = () => {
      try {
        let text = r.result;

        let jsonText = text.toString();
        // console.log(jsonText);
        let obj = JSON.parse(jsonText);

        //console.log(obj);

        this.menu = obj;

        console.log("Menu");
        console.log(this.menu);

        this.jsonMessage = "Loading JSON success"
      } catch (e) {
        this.message = 'Error while loading JSON file';
      }
    }

    r.readAsText(this.inputFile, 'UTF-8');

  }



  onMainImagePicked(event: Event) {
    //console.log("Image picked");
    this.message = null;

    this.imageUploadMain = (event.target as HTMLInputElement).files[0];
    //console.log(this.imageUploadMain);

    const reader = new FileReader();
    reader.onload = () => {

      this.imagePreviewMain = reader.result;

      const x = new Image();

      x.src = reader.result as string;

      //da se upise ime slike
      this.imageMainName = this.imageUploadMain.name;

      //za rezoluciju
      /*
      x.onload = () => {
        if (x.width > 300 || x.width < 100 || x.height > 300 || x.height < 100) {
          this.message = "Main image is not within required resolution";
         
        }
      }
    */

    };
    //citanje fajla
    reader.readAsDataURL(this.imageUploadMain);

  }


  onCoverImagePicked(event: Event) {
    //console.log("Image picked");
    this.message = null;

    this.imageUploadCover = (event.target as HTMLInputElement).files[0];
    //console.log(this.imageUploadCover);

    const reader = new FileReader();
    reader.onload = () => {

      this.imagePreviewCover = reader.result;

      const x = new Image();

      x.src = reader.result as string;

      //da se upise ime slike
      this.imageCoverName = this.imageUploadCover.name;

      //za rezoluciju
      /*
      x.onload = () => {
        if (x.width > 1400 || x.width < 800 || x.height > 600 || x.height < 300) {
          this.message = "Cover image is not within required resolution";
         
        }
      }

      */

    };
    //citanje fajla
    reader.readAsDataURL(this.imageUploadCover);

  }



  onOtherImagesPicked(event: Event) {
    //console.log("Images picked");
    this.message = null;
    this.imagesPreview = new Array<any>();

    this.imagesUpload = (event.target as HTMLInputElement).files;
    //console.log("Images upload");
    //console.log(this.imagesUpload);

    //postavljanje imena
    this.imagesName = this.imagesUpload.length + " images picked";

    //console.log("Prva slika");
    //console.log(this.imagesUpload[0]);


    //imagesUpload je FileList, pretvaramo u Array i radimo forech
    //iteriramo kroz file list kako bi sve slike obradili
    Array.from(this.imagesUpload).forEach(element => {
      //console.log("Slika:");
      //console.log(element);
      //citanje fajla
      this.readFileImage(element);
    });
  }

  readFileImage(image: File) {
    const reader = new FileReader();

    //callback za reader
    reader.onload = () => {

      this.imagesPreview.push(reader.result);


      //console.log("Reader result");
      //console.log(reader.result);

      this.imagesNameArray.push(image.name);

      //console.log("Images preview");
      //console.log(this.imagesPreview);

      const x = new Image();

      x.src = reader.result as string;

    };
    reader.readAsDataURL(image);
  }





  addToDatabase() {
    console.log("add to database");


    //prvo dodavanje restorana sa profilnom i cover slikom


    this.adminService.addRestaurant(this.restaurant, this.menu, this.imageUploadMain, this.imageUploadCover,this.imagesUpload, this.imagesNameArray);




  }

}
