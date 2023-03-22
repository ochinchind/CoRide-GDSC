import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConfigService } from '../config.service';
import { Inject }  from '@angular/core';
import { DOCUMENT } from '@angular/common'; 
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
@Component({
  selector: 'app-show-data',
  templateUrl: './show-data.component.html',
  styleUrls: ['./show-data.component.css']
})
export class ShowDataComponent implements OnInit, AfterViewInit {
  display: any;
  data?: any[];
  center: google.maps.LatLngLiteral = { lat: -33.8688, lng: 151.2195 };
  zoom = 13;
  
  constructor(private myService: ConfigService, public http: HttpClient, public jwtHelper: JwtHelperService) { 

  }
  ngAfterViewInit(): void {
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

    //function
    function calcRoute(){
      var request = {
        origin: (document.getElementById('from') as HTMLInputElement).value,
        destination: (document.getElementById('to') as HTMLInputElement).value,
        travelMode: google.maps.TravelMode.DRIVING, //WALKIMG, BYCICLYNG
        unitSystem: google.maps.UnitSystem.IMPERIAL
      }
      //pass request to the route method
      directionsService.route(request, (result, status)=> {
        if(status == google.maps.DirectionsStatus.OK){
          //get distance and time
          const output = document.querySelector('#output');
          if(output != undefined){
            output!.innerHTML = "<div class='alert-info'> From: " + (document.getElementById('from') as HTMLInputElement).value + ".<br />To: " + (document.getElementById('to') as HTMLInputElement).value + ". <br /> Driving distance <i class='fas fa-road'></i>:" + result?.routes[0].legs[0].distance?.text + ".<br /> Duration<i class='fas fa-hourglass-start'></i> : " + result?.routes[0].legs[0].duration?.text + ". </div>";  
          }

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

    //create autocomplete objects for all input
    var options = {
      types:['address']
    }
    var input1 = document.getElementById('from') as HTMLInputElement;
    var autocomplete1 = new google.maps.places.Autocomplete(input1, options);
    var input2 = document.getElementById('to') as HTMLInputElement;
    var autocomplete2 = new google.maps.places.Autocomplete(input2, options);



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
      console.log(data);
    })
    this.myService.getData().subscribe((data) => {
      this.data = data;
      console.log(data);
    });
    const input: HTMLInputElement = document.getElementById("pac-input") as HTMLInputElement;
  }
  ping(){
    this.http.get("http://127.0.0.1:8000/getUser/").subscribe(
      (data) => console.log(data),
      (err) => console.log(err)
    );
  }

  moveMap(event: google.maps.MapMouseEvent){
    if(event.latLng != null)
    this.center = (event.latLng.toJSON());
  }
  move(event: google.maps.MapMouseEvent){
    if(event.latLng != null)
    this.display = event.latLng.toJSON();
  }

}
