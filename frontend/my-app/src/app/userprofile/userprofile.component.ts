import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ConfigService } from '../config.service';
import { Emitters } from '../emitters/emitters';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit, AfterViewInit {
  currentUser:any;
  id:any;
  authenticated:any;
  form: FormGroup = this.formBuilder.group({
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', Validators.compose([Validators.required, Validators.email])],
    company: '',
  });

  constructor(private myService: ConfigService,private formBuilder: FormBuilder, public http: HttpClient, public jwtHelper: JwtHelperService, private router: Router) { 

  }
  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
    
    this.myService.getUser().subscribe((data)=>{
      this.currentUser = data;
      Emitters.authEmitter.emit(true);
      
      this.id = data['id'];
      this.form.patchValue({
        firstname: this.currentUser.firstname,
        lastname: this.currentUser.lastname,
        phone: this.currentUser.phone,
        email: this.currentUser.email,
        company: this.currentUser.company ? this.currentUser.company : '',
      });
    }, (err)=>{
      console.log(err);
      Emitters.authEmitter.emit(false);
    });
    Emitters.authEmitter.subscribe(
      (auth: boolean) => {
        this.authenticated = auth;
      }
    )
      
  }


  logout():void {
    this.myService.logout().subscribe(()=> {
      
      this.authenticated = false;
      Emitters.authEmitter.emit(false);
      window.location.reload();
    })
  }

  submit(){

  }

}
