import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ConfigService } from '../config.service';
import { Emitters } from '../emitters/emitters';

@Component({
  selector: 'app-userview',
  templateUrl: './userview.component.html',
  styleUrls: ['./userview.component.css']
})
export class UserviewComponent implements OnInit, AfterViewInit  {
  routeid?:any;
  route?:any;
  active?:boolean;
  errors? : string;
  id? :string;
  authenticated = false;
  display: any;
  center: google.maps.LatLngLiteral = { lat: -33.8688, lng: 151.2195 };
  initial_address:any;
  destination :any;
  distance?: any;
  time? : any
  zoom = 13;
  constructor(private myService: ConfigService, public http: HttpClient, public jwtHelper: JwtHelperService, private router: Router) { 

  }

  renderMap(){
    let lat = 43.238949;
    let lng = 76.889709;
    if(!navigator.geolocation){
      console.log('location is not supported');
    }
    navigator.geolocation.getCurrentPosition((position)=>{
      lat = position.coords.latitude;
      lng = position.coords.longitude;
    })

     //setting map options
     var myLatLng = { lat: lat, lng: lng};
     var mapOptions = {
       center: myLatLng,
       zoom: 13,
       mapTypeId: google.maps.MapTypeId.ROADMAP
     };
     //creating a map
     var map = new google.maps.Map(document.getElementById('googleMap') as HTMLElement, mapOptions);
     //create Directions service object to use the route method
     var directionsService = new google.maps.DirectionsService();
 
     //create a Directions renderer object to display the route
     var directionsDisplay = new google.maps.DirectionsRenderer();
 
     //bind directions renderer to the map
     directionsDisplay.setMap(map);
 
     //create autocomplete objects for all input
     var options = {
       types:['address']
     }
     var input1 = document.getElementById('from') as HTMLInputElement;
     var autocomplete1 = new google.maps.places.Autocomplete(input1, options);
     var input2 = document.getElementById('to') as HTMLInputElement;
     var autocomplete2 = new google.maps.places.Autocomplete(input2, options); 

  }

  ngAfterViewInit(): void {
    this.lookforRoutes();
    let lat = 43.238949;
    let lng = 76.889709;
    if(!navigator.geolocation){
      console.log('location is not supported');
    }
    navigator.geolocation.getCurrentPosition((position)=>{
      lat = position.coords.latitude;
      lng = position.coords.longitude;
    })

     //setting map options
     var myLatLng = { lat: lat, lng: lng};
     var mapOptions = {
       center: myLatLng,
       zoom: 13,
       mapTypeId: google.maps.MapTypeId.ROADMAP
     };
     //creating a map
     var map = new google.maps.Map(document.getElementById('googleMap') as HTMLElement, mapOptions);
     //create Directions service object to use the route method
     var directionsService = new google.maps.DirectionsService();
 
     //create a Directions renderer object to display the route
     var directionsDisplay = new google.maps.DirectionsRenderer();
 
     //bind directions renderer to the map
     directionsDisplay.setMap(map);
 
     //create autocomplete objects for all input
     var options = {
       types:['address']
     }
     var input1 = document.getElementById('from') as HTMLInputElement;
     var autocomplete1 = new google.maps.places.Autocomplete(input1, options);
     var input2 = document.getElementById('to') as HTMLInputElement;
     var autocomplete2 = new google.maps.places.Autocomplete(input2, options); 

  }

  DefineRoute(){
    let lat = 43.238949;
    let lng = 76.889709;
    if(!navigator.geolocation){
      console.log('location is not supported');
    }
    navigator.geolocation.getCurrentPosition((position)=>{
      lat = position.coords.latitude;
      lng = position.coords.longitude;
    })

     //setting map options
     var myLatLng = { lat: lat, lng: lng};
     var mapOptions = {
       center: myLatLng,
       zoom: 13,
       mapTypeId: google.maps.MapTypeId.ROADMAP
     };
     //creating a map
     var map = new google.maps.Map(document.getElementById('googleMap') as HTMLElement, mapOptions);
     //create Directions service object to use the route method
     var directionsServiceActive = new google.maps.DirectionsService();
 
     //create a Directions renderer object to display the route
     var directionsDisplayActive = new google.maps.DirectionsRenderer();
 
     //bind directions renderer to the map
     directionsDisplayActive.setMap(map);

    this.initial_address = this.route['initial_address'];
    this.destination = this.route['end_address'];
    //creating a map
    var map = new google.maps.Map((document.getElementById('googleMap') as HTMLElement), mapOptions);
    //create Directions service object to use the route method
    var directionsServiceActive = new google.maps.DirectionsService();

    //create a Directions renderer object to display the route
    var directionsDisplayActive = new google.maps.DirectionsRenderer();

    //bind directions renderer to the map
    directionsDisplayActive.setMap(map);
    var request = {
      origin: this.initial_address,
      destination: this.destination,
      travelMode: google.maps.TravelMode.DRIVING, //WALKIMG, BYCICLYNG
      unitSystem: google.maps.UnitSystem.METRIC
    }
    //pass request to the route method
    directionsServiceActive.route(request, (result, status)=> {
      if(status == google.maps.DirectionsStatus.OK){
        //get distance and time
        const output = document.querySelector('#output');
        if(output != undefined){
          output!.innerHTML = "<div class='alert-info'> From: " + this.initial_address + ".<br />To: " + this.destination + ". <br /> Driving distance <i class='fas fa-road'></i>:" + result?.routes[0].legs[0].distance?.text + ".<br /> Duration<i class='fas fa-hourglass-start'></i> : " + result?.routes[0].legs[0].duration?.text + ". </div>";  
        }


        this.distance = result?.routes[0].legs[0].distance?.text;
        this.time = result?.routes[0].legs[0].duration?.text;

        //directions route
        directionsDisplayActive.setDirections(result);
      } else {
        //delete route from map
        directionsDisplayActive.setDirections({ routes: [] });

        //center map in spain
        map.setCenter(myLatLng);
        const output = document.querySelector('#output');

        //show error message 
        output!.innerHTML = "<div class='alert-danger><i class='fas fa-exclamation-triangle'></i>Could not receive driving distance</div>";
      }
    } )
  }

  calcRoute(){
    //setting map options
    var myLatLng = { lat: 38.3460, lng: -0.4907};
    var mapOptions = {
      center: myLatLng,
      zoom: 7,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    //creating a map
    var map = new google.maps.Map(document.getElementById('googleMap') as HTMLElement, mapOptions);
    //create Directions service object to use the route method
    var directionsService = new google.maps.DirectionsService();

    //create a Directions renderer object to display the route
    var directionsDisplay = new google.maps.DirectionsRenderer();

    //bind directions renderer to the map
    directionsDisplay.setMap(map);
    var request = {
      origin: (document.getElementById('from') as HTMLInputElement).value,
      destination: (document.getElementById('to') as HTMLInputElement).value,
      travelMode: google.maps.TravelMode.DRIVING, //WALKIMG, BYCICLYNG
      unitSystem: google.maps.UnitSystem.METRIC
    }
    //pass request to the route method
    directionsService.route(request, (result, status)=> {
      if(status == google.maps.DirectionsStatus.OK){
        //get distance and time
        const output = document.querySelector('#output');
        if(output != undefined){
          output!.innerHTML = "<div class='alert-info'> From: " + (document.getElementById('from') as HTMLInputElement).value + ".<br />To: " + (document.getElementById('to') as HTMLInputElement).value + ". <br /> Driving distance <i class='fas fa-road'></i>:" + result?.routes[0].legs[0].distance?.text + ".<br /> Duration<i class='fas fa-hourglass-start'></i> : " + result?.routes[0].legs[0].duration?.text + ". </div>";  
        }


        this.initial_address = (document.getElementById('from') as HTMLInputElement).value;
        this.destination = (document.getElementById('to') as HTMLInputElement).value;
        this.distance = result?.routes[0].legs[0].distance?.text;
        this.time = result?.routes[0].legs[0].duration?.text;

        //directions route
        directionsDisplay.setDirections(result);
      } else {
        //delete route from map
        directionsDisplay.setDirections({ routes: [] });

        //center map in spain
        map.setCenter(myLatLng);
        const output = document.querySelector('#output');

        //show error message 
        output!.innerHTML = "<div class='alert-danger><i class='fas fa-exclamation-triangle'></i>Could not receive driving distance</div>";
      }
    } )


  }

  ngOnInit(): void {
    this.myService.getUser().subscribe((data)=>{
      Emitters.authEmitter.emit(true);
      console.log(data);
      if(data['type'] == 'driver'){
        this.router.navigate(['driverview']);
      } else if(data['type'] == 'company'){
        this.router.navigate(['companyview']);
      }
      this.id = data['id'];
    }, (err)=>{
      console.log(err);
      Emitters.authEmitter.emit(false);
    });
    Emitters.authEmitter.subscribe(
      (auth: boolean) => {
        this.authenticated = auth;
      }
    )
    this.lookforRoutes();
      
  }

  lookforRoutes(){
    this.active = false;
    Emitters.activeEmitter.emit(false);
    this.myService.getRoute().subscribe((data)=>{
      data.forEach((element:any) => {
        if(element['active']==1){
          if(element['client_id']==this.id){
            Emitters.activeEmitter.emit(true);
            this.route = element;
            this.active =true;
            this.routeid = element['id'];
            this.DefineRoute();
          }
        }
      });
    })
  }

  moveMap(event: google.maps.MapMouseEvent){
    if(event.latLng != null)
    this.center = (event.latLng.toJSON());
  }
  move(event: google.maps.MapMouseEvent){
    if(event.latLng != null)
    this.display = event.latLng.toJSON();
  }

  logout():void {
    this.myService.logout().subscribe(()=> {
      
      this.authenticated = false;
      Emitters.authEmitter.emit(false);
    })
  }

  order(){
    if(this.initial_address && this.destination && this.distance && this.time){
      this.myService.postRoute(this.initial_address, this.destination, this.distance, this.time, this.id).subscribe((data)=>{
        console.log(data);
        this.errors=undefined;
        this.active= true;
        this.lookforRoutes();
      });
    } else {
      this.errors="Сначала рассчитайте дорогу";
    }
  }

  cancelRoute(){
      this.myService.deleteRoute(this.routeid).subscribe((data)=>{
        console.log(data);
        this.lookforRoutes();
        this.renderMap();
      })
  }

}
