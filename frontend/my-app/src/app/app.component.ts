import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ConfigService } from './config.service';
import { Emitters } from './emitters/emitters';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  authenticated = false;

  constructor(private myService: ConfigService, public http: HttpClient, public jwtHelper: JwtHelperService, private router: Router) { 

  }

  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }
  ngOnInit(): void {
    this.myService.getUser().subscribe({
      next: (data)=>{
      Emitters.authEmitter.emit(true);
      console.log(data);
    }, error: (err)=>{
      console.log(err);
      Emitters.authEmitter.emit(false);
    }});

    Emitters.authEmitter.subscribe(
      (auth: boolean) => {
        this.authenticated = auth;
        if(this.authenticated == false){
          this.router.navigate(['/']);
        } else {
          
        }
      }
    )
  }

  logout():void {
    this.myService.logout().subscribe(()=> {
      this.authenticated = false;
      Emitters.authEmitter.emit(false);
    })
  }


  
}
