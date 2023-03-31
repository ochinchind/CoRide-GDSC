import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ConfigService } from '../config.service';
import { Emitters } from '../emitters/emitters';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-driverview',
  templateUrl: './driverview.component.html',
  styleUrls: ['./driverview.component.css']
})
export class DriverviewComponent implements OnInit, AfterViewInit {
  errors:any;
  allendroutes?:any;
  id:any;
  active?:any;
  initial_address:any;
  destination:any;
  distance:any;
  time:any;
  allroutes?:any;
  allclients?:any;
  authenticated = false;
  constructor(private chatService: ChatService, private myService: ConfigService, public http: HttpClient, public jwtHelper: JwtHelperService, private router: Router) { 
    chatService.message?.subscribe(msg => {
      console.log('Response:' + msg);
    })
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
    this.myService.getEndRoutes().subscribe((data)=>{
      this.allendroutes = data;
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

  findlocations(route_ids:any):string{
    let locations = "";
    let someroutes = route_ids.split("%");
    this.allroutes.forEach((element:any) => {
      someroutes.forEach((element1:any) => {
        if(element1 == element['id']){
          locations += " " + element['initial_address'];
        }
      });
    })
    return locations;
  }

  renderRoute(route_ids:any, lat_end:any, lng_end:any){
    //setting map options
    var myLatLng = { lat: 38.3460, lng: -0.4907};
    var mapOptions = {
      center: myLatLng,
      zoom: 7,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    const numberArray = route_ids.split("%").map(Number.parseFloat);
    numberArray.push(lat_end);
    numberArray.push(lng_end);
    console.log(numberArray);
    var map = new google.maps.Map(document.getElementById('googleMap') as HTMLElement, mapOptions);

    var point1 = new google.maps.LatLng(numberArray[0], numberArray[1]);
    var point2 = new google.maps.LatLng(numberArray[2], numberArray[3]);

    //creating a map
    //create Directions service object to use the route method
    var directionsService = new google.maps.DirectionsService();

    //create a Directions renderer object to display the route
    var directionsDisplay = new google.maps.DirectionsRenderer();

    //bind directions renderer to the map
    directionsDisplay.setMap(map);
    var request = {
      origin: point1,
      destination: point2,
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
          output!.innerHTML = "<div class='alert-info'> From: " + point1 + ".<br />To: " + point2 + ". <br /> Driving distance <i class='fas fa-road'></i>:" + result?.routes[0].legs[0].distance?.text + ".<br /> Duration<i class='fas fa-hourglass-start'></i> : " + result?.routes[0].legs[0].duration?.text + ". </div>";  
        }


        this.initial_address = point1;
        this.destination = point2;
        this.distance = result?.routes[0].legs[0].distance?.text;
        this.time = result?.routes[0].legs[0].duration?.text;
        this.errors = undefined;
        //directions route
        directionsDisplay.setDirections(result);

        if(numberArray[4]){
          var directionsService1 = new google.maps.DirectionsService();

          //create a Directions renderer object to display the route
          var directionsDisplay1 = new google.maps.DirectionsRenderer();
      
          //bind directions renderer to the map
          directionsDisplay1.setMap(map);
          var point3 = new google.maps.LatLng(numberArray[4], numberArray[5]);
          var request = {
            origin: point2,
            destination: point3,
            travelMode: google.maps.TravelMode.DRIVING, //WALKIMG, BYCICLYNG
            unitSystem: google.maps.UnitSystem.METRIC
          }
          console.log(request);
          //pass request to the route method
          directionsService1.route(request, (result1, status)=> {
            if(status == google.maps.DirectionsStatus.OK){
              //get distance and time
              const output = document.querySelector('#output');
              if(output != undefined){
                output!.innerHTML = "<div class='alert-info'> From: " + point1 + ".<br />To: " + point3 + ". <br /> Driving distance <i class='fas fa-road'></i>:" + result1?.routes[0].legs[0].distance?.text + ".<br /> Duration<i class='fas fa-hourglass-start'></i> : " + result1?.routes[0].legs[0].duration?.text + ". </div>";  
              }
      
      
              this.initial_address = point1;
              this.destination = point3;
              this.distance = result1?.routes[0].legs[0].distance?.text;
              this.time = result1?.routes[0].legs[0].duration?.text;
              this.errors = undefined;
              //directions route
              directionsDisplay1.setDirections(result1);

              } else {
                //delete route from map
                directionsDisplay1.setDirections({ routes: [] });
        
                //center map in spain
                map.setCenter(myLatLng);
                const output = document.querySelector('#output');
        
                //show error message 
                output!.innerHTML = "<div class='alert-danger><i class='fas fa-exclamation-triangle'></i>Could not receive driving distance</div>";
              }
            } )
        }



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
