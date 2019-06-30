import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';

import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from 'src/app/services/auth.service';
import { Restaurant } from 'src/app/models/restaurant.model';
import { Menu } from 'src/app/models/menu.model';
import { SelectItem } from 'primeng/api';
import { Review } from 'src/app/models/review.model';
import { ReviewItem } from 'src/app/models/reviewitem.model';
import { MapsService } from 'src/app/services/maps.service';

interface Location {
  lat: number;
  lng: number;
}



@Component({
  selector: 'app-change-restaurant',
  templateUrl: './change-restaurant.component.html',
  styleUrls: ['./change-restaurant.component.css']
})

export class ChangeRestaurantComponent implements OnInit {

  restaurant: Restaurant = null;
  menu: Menu = null;
  review: Review = null;

  message: String = null;
  jsonMessage: String = null;

  //za prvi tab (Basic Info)
  restaurantForm: FormGroup;
  municipalities: SelectItem[];
  workHoursFrom: SelectItem[];
  workHoursTo: SelectItem[];
  cuisine: SelectItem[];
  dressCode: SelectItem[];
  pricingCategory: SelectItem[];

  sliderValue: Number = 1;


  //za drugi tab (Menu)
  inputFile: File = null;
  updatedMenu: Menu = null;
  public isCollapsed: boolean = false;


  //za treci tab (Images)
  //za glavnu sliku
  imageUploadMain: File = null;
  imagePreviewMain = null;
  imageMainName: String = "";
  imageMainMessage: String = null;

  //za cover sliku
  imageUploadCover: File = null;
  imagePreviewCover = null;
  imageCoverName: String = "";
  imageCoverMessage: String = null;

  //za ostale slike
  imagesUpload: FileList = null;
  imagesPreview: Array<any> = new Array<any>();
  imagesName: String = "";
  imagesNameArray: Array<String> = new Array<String>();


  //za mape
  location: Location;
  loading: boolean;


  constructor(private authService: AuthService, private router: Router,
    private adminService: AdminService, private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private gMapsService: MapsService,
    private __zone: NgZone,
    private ref: ChangeDetectorRef) {
    this.restaurantForm = this.formBuilder.group({
      name: ['name', Validators.required],
      address: ['', Validators.required],
      municipality: ['', Validators.required],
      workHoursStartWorkdays: ['', Validators.required],
      workHoursEndWorkdays: ['', Validators.required],
      workHoursStartSaturday: ['', Validators.required],
      workHoursEndSaturday: ['', Validators.required],
      workHoursStartSunday: ['', Validators.required],
      workHoursEndSunday: ['', Validators.required],
      cuisine: ['', Validators.required],
      dressCode: ['', Validators.required],
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

    //inicijalizacija select-a

    this.municipalities = [
      { value: 'Stari grad', label: 'Stari grad' },
      { value: 'Savski venac', label: 'Savski venac' },
      { value: 'Vracar', label: 'Vračar' },
      { value: 'Novi Beograd', label: 'Novi Beograd' },
      { value: 'Cukarica', label: 'Čukarica' },
      { value: 'Rakovica', label: 'Rakovica' },
      { value: 'Vozdovac', label: 'Voždovac' },
      { value: 'Zvezdara', label: 'Zvezdara' },
      { value: 'Zemun', label: 'Zemun' },
      { value: 'Palilula', label: 'Palilula' },
      { value: 'Surcin', label: 'Surčin' },
      { value: 'Obrenovac', label: 'Obrenovac' },
      { value: 'Barajevo', label: 'Barajevo' },
      { value: 'Sopot', label: 'Sopot' },
      { value: 'Grocka', label: 'Grocka' },
      { value: 'Lazarevac', label: 'Lazarevac' },
      { value: 'Mladenovac', label: 'Mladenovac' }
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



    let restaurantKey = this.route.snapshot.paramMap.get("restaurantKey");

    //dohvatanje restorana
    this.adminService.getRestaurantInfo(restaurantKey).subscribe((result) => {
      //console.log("Result");
      //console.log(result);
      this.restaurant = result.restaurant;
      this.menu = result.menu;
      this.review = result.review;

      console.log(this.review);


      //dodjela polja restaurantForm da bi forma prikazivala trenutno stanje

      this.restaurantForm.controls.name.setValue(this.restaurant.name);
      this.restaurantForm.controls.address.setValue(this.restaurant.address);
      this.restaurantForm.controls.municipality.setValue(this.restaurant.municipality);
      this.restaurantForm.controls.cuisine.setValue(this.restaurant.cuisine);
      this.restaurantForm.controls.dressCode.setValue(this.restaurant.dressCode);
      this.restaurantForm.controls.paymentOptions.setValue(this.restaurant.paymentOptions);
      this.restaurantForm.controls.additional.setValue(this.restaurant.additional);
      this.restaurantForm.controls.website.setValue(this.restaurant.website);
      this.restaurantForm.controls.contactPhone.setValue(this.restaurant.contactPhone);
      this.restaurantForm.controls.category.setValue(this.restaurant.category);
      this.restaurantForm.controls.capacity.setValue(this.restaurant.capacity);
      this.sliderValue = this.restaurant.capacity;
      this.restaurantForm.controls.description.setValue(this.restaurant.description);



      //work hours workdays
      let workHoursWorkdays = this.restaurant.workHoursWorkdays;

      let workHoursStart = workHoursWorkdays.split("-")[0];
      let workHoursEnd = workHoursWorkdays.split("-")[1];

      workHoursStart = workHoursStart.split(" ")[0];
      workHoursEnd = workHoursEnd.split(" ")[1];


      this.restaurantForm.controls.workHoursStartWorkdays.setValue(workHoursStart);
      this.restaurantForm.controls.workHoursEndWorkdays.setValue(workHoursEnd);

      //work hours saturday

      //ako ne radi subotom

      let workHoursSaturday = this.restaurant.workHoursSaturday;

      let workHoursStart2 = workHoursSaturday.split("-")[0];
      let workHoursEnd2 = workHoursSaturday.split("-")[1];

      workHoursStart2 = workHoursStart2.split(" ")[0];
      workHoursEnd2 = workHoursEnd2.split(" ")[1];


      this.restaurantForm.controls.workHoursStartSaturday.setValue(workHoursStart2);
      this.restaurantForm.controls.workHoursEndSaturday.setValue(workHoursEnd2);

      //work hours sunday
      let workHoursSunday = this.restaurant.workHoursSunday;

      let workHoursStart3 = workHoursSunday.split("-")[0];
      let workHoursEnd3 = workHoursSunday.split("-")[1];

      workHoursStart3 = workHoursStart3.split(" ")[0];
      workHoursEnd3 = workHoursEnd3.split(" ")[1];


      this.restaurantForm.controls.workHoursStartSunday.setValue(workHoursStart3);
      this.restaurantForm.controls.workHoursEndSunday.setValue(workHoursEnd3);

    })

  }


  //za prvi tab
  onSubmit() {
    console.log("submit");

    this.message = "";

    if (this.restaurantForm.invalid) {
      this.message = "Please enter all data";
      return;
    }

    //pocetni latitude i longitude
    let latitude = this.restaurant.latitude;
    let longitude = this.restaurant.longitude;


    //ako je promijenjena adresa, onda trazimo novi lat i lng
    if (this.restaurantForm.controls.address.value != this.restaurant.address) {
      console.log("Promijenjena adresa");

      //POZIVA SE GOOGLE MAPS SERVICE ZA ODREDJIVANE NOVIH KOORDINATA NOVE ADRESE
      this.loading = true;
      this.gMapsService.geocodeAddress(this.restaurantForm.controls.address.value + " Belgrade")
        .subscribe((location: Location) => {
          this.location = location;
          console.log("coordinates");
          console.log(this.location);
          latitude = this.location.lat;
          longitude = this.location.lng;
          this.loading = false;
          this.ref.detectChanges();

          //NAKON ODREDJIVANJA NOVE LOKACIJE, UPDATE-UJE SE RESTORAN
          this.updateRestaurantInfo(latitude, longitude);

        }
        );


    } else {
      //NIJE PROMIJENJENA ADRESA
      console.log("nije promijenjena adresa");
      this.updateRestaurantInfo(latitude, longitude);

    }

  }



  updateRestaurantInfo(latitude: Number, longitude: Number) {
    //prosle sve provjere, sve je uneseno, izmjena restorana
    const restaurantData: Restaurant = {
      name: this.restaurantForm.controls.name.value,
      key: this.restaurant.key, //KLJUC SE NIKAD NE MIJENJA
      address: this.restaurantForm.controls.address.value,
      municipality: this.restaurantForm.controls.municipality.value,
      workHoursWorkdays: this.restaurantForm.controls.workHoursStartWorkdays.value + " - " + this.restaurantForm.controls.workHoursEndWorkdays.value,
      workHoursSaturday: this.restaurantForm.controls.workHoursStartSaturday.value + " - " + this.restaurantForm.controls.workHoursEndSaturday.value,
      workHoursSunday: this.restaurantForm.controls.workHoursStartSunday.value + " - " + this.restaurantForm.controls.workHoursEndSunday.value,
      cuisine: this.restaurantForm.controls.cuisine.value,
      dressCode: this.restaurantForm.controls.dressCode.value,
      paymentOptions: this.restaurantForm.controls.paymentOptions.value,
      additional: this.restaurantForm.controls.additional.value,
      website: this.restaurantForm.controls.website.value,
      contactPhone: this.restaurantForm.controls.contactPhone.value,
      category: this.restaurantForm.controls.category.value,
      capacity: this.restaurantForm.controls.capacity.value,
      description: this.restaurantForm.controls.description.value,
      mainPicture: null,
      coverPicture: null,
      pictures: new Array<String>(),
      latitude: latitude,
      longitude: longitude,
      sumGrades: this.restaurant.sumGrades,
      totalGrades: this.restaurant.totalGrades,
      distanceString: null,
      distanceNumber: 0,
      durationString: null
    }



    this.adminService.changeRestaurantInfo(restaurantData)
      .subscribe((result) => {

        //console.log(result.message);
        if (result.message == "Success") {
          this.restaurant = result.restaurant;
          //console.log("Restaurant changes");
          //console.log(this.restaurant);
        }

      });
  }



  handleSliderChange(event) {
    this.sliderValue = event.value;
  }

  //za drugi tab

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

        this.updatedMenu = obj;

        //console.log("Menu");
        //console.log(this.menu);

        this.jsonMessage = "Loading JSON success"
      } catch (e) {
        this.message = 'Error while loading JSON file';
      }
    }

    r.readAsText(this.inputFile, 'UTF-8');

  }


  changeMenu() {

    //promjena menija


    //konstrukcija menija kao u bazi
    const data = {
      restaurantKey: this.restaurant.key,
      appetizers: this.updatedMenu.appetizers,
      mains: this.updatedMenu.mains,
      desserts: this.updatedMenu.desserts,
      salads: this.updatedMenu.salads,
      soups: this.updatedMenu.soups,
      nonalcoholic: this.updatedMenu.nonalcoholic,
      alcoholic: this.updatedMenu.alcoholic,
      wines: this.updatedMenu.wines
    }


    this.adminService.changeRestaurantMenu(data)
      .subscribe((result) => {

        console.log("Result");
        console.log(result.message);

        if (result.message == "Success") {
          //meni promijenjen, mijenjamo postojeci u komponenti
          this.menu = this.updatedMenu;
          this.jsonMessage = "";
        }

      })


  }


  //za treci tab


  onMainImagePicked(event: Event) {
    //console.log("Image picked");
    this.imageMainMessage = null;

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
      x.onload = () => {
        if (x.width > 300 || x.width < 100 || x.height > 300 || x.height < 100) {
          this.imageMainMessage = "Main image is not within required resolution";

        }
      }

    };
    //citanje fajla
    reader.readAsDataURL(this.imageUploadMain);

  }


  onCoverImagePicked(event: Event) {
    //console.log("Image picked");
    this.imageCoverMessage = null;

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
      x.onload = () => {
        if (x.width > 1400 || x.width < 800 || x.height > 600 || x.height < 300) {
          this.imageCoverMessage = "Cover image is not within required resolution";

        }
      }

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

    console.log(this.imagesNameArray);
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



  changeCoverImage() {
    //console.log("change cover");

    this.adminService.changeCoverImage(this.imageUploadCover, this.restaurant.key)
      .subscribe((result) => {
        console.log(result.message);
        //update-ovati cover da se prikazuje
      })
  }

  changeMainImage() {

    //console.log("change main");

    this.adminService.changeMainImage(this.imageUploadMain, this.restaurant.key)
      .subscribe((result) => {
        console.log(result.message);
        //update-ovati cover da se prikazuje
      })

  }


  addMoreImages() {


    this.adminService.addMoreImages(this.imagesUpload, this.imagesNameArray, this.restaurant.key)
      .subscribe((result) => {
        console.log(result.message);
      })

  }

  deleteImage(imageName: string) {
    console.log("delete image " + imageName);

    const data = {
      imageName: imageName,
      restaurantKey: this.restaurant.key
    }

    this.adminService.deleteImage(data)
      .subscribe((result) => {
        console.log(result.message);
      })
  }


  //za cetvrti tab


  deleteReview(reviewItem: ReviewItem) {
    //console.log(reviewItem);


    const data = {
      restaurantKey: this.review.restaurantKey,
      username: reviewItem.username,
      grade: reviewItem.grade,
      comment: reviewItem.comment,
      dateTime: reviewItem.dateTime
    }
    //console.log(data);

    //izbrisati iz baze
    this.adminService.deleteReview(data).subscribe((result) => {
      //console.log(result.message);

      //ukloniti iz trenutnog niza
      const index: number = this.review.reviews.indexOf(reviewItem);
      this.review.reviews.splice(index, 1);


    })
  }
}
