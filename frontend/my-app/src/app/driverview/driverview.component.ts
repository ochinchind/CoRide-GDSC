import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ConfigService } from '../config.service';
import { Emitters } from '../emitters/emitters';

@Component({
  selector: 'app-driverview',
  templateUrl: './driverview.component.html',
  styleUrls: ['./driverview.component.css']
})
export class DriverviewComponent implements OnInit, AfterViewInit {
  errors:any;
  id:any;
  active?:any;
  initial_address:any;
  destination:any;
  distance:any;
  time:any;
  allroutes?:any;
  allclients?:any;
  authenticated = false;
  constructor(private myService: ConfigService, public http: HttpClient, public jwtHelper: JwtHelperService, private router: Router) { 

  }
  ngAfterViewInit(): void {

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

  }
  ngOnInit(): void {    
    this.myService.getUser().subscribe((data)=>{
      Emitters.authEmitter.emit(true);
      console.log(data);
      if(data['type'] == 'client'){
        this.router.navigate(['userview']);
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
    this.myService.getRoute().subscribe((data)=>{
      this.allroutes = data;
    })
    this.myService.getClients().subscribe((data)=>{
      this.allclients = data;
    })

  }


  logout():void {
    this.myService.logout().subscribe(()=> {
      
      this.authenticated = false;
      Emitters.authEmitter.emit(false);
    })
  }

  findname(client_id:any) :string{
    let clientname = 'Не найден';
    this.allclients.forEach((element: any) => {
      if(client_id == element['id']){
        let firstname:string = element['firstname'];
        let lastname:string = element['lastname'];
        clientname = firstname + ' ' + lastname;
      }
    });
    return clientname;
  }

  renderRoute(initial_address:any, end_address:any){
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
      origin: initial_address,
      destination: end_address,
      travelMode: google.maps.TravelMode.DRIVING, //WALKIMG, BYCICLYNG
      unitSystem: google.maps.UnitSystem.METRIC
    }
    console.log(request);
    //pass request to the route method
    directionsService.route(request, (result, status)=> {
      if(status == google.maps.DirectionsStatus.OK){
        //get distance and time
        const output = document.querySelector('#output');
        if(output != undefined){
          output!.innerHTML = "<div class='alert-info'> From: " + initial_address + ".<br />To: " + end_address + ". <br /> Driving distance <i class='fas fa-road'></i>:" + result?.routes[0].legs[0].distance?.text + ".<br /> Duration<i class='fas fa-hourglass-start'></i> : " + result?.routes[0].legs[0].duration?.text + ". </div>";  
        }


        this.initial_address = initial_address;
        this.destination = end_address;
        this.distance = result?.routes[0].legs[0].distance?.text;
        this.time = result?.routes[0].legs[0].duration?.text;
        this.errors = undefined;
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


  takeorder(){
    if(this.initial_address && this.destination && this.time && this.distance){

    } else {
      this.errors = "Сначала выберите заказ";
    }
  }

}
