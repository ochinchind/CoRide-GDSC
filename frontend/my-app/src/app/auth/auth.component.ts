import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigService } from '../config.service';
import { CookieService } from 'ngx-cookie-service';
import { Emitters } from '../emitters/emitters';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  form: FormGroup = this.formBuilder.group({
    email: ['', Validators.compose([Validators.required, Validators.email])],
    password: ['', Validators.required]
  });

  constructor(private formBuilder: FormBuilder,private cookieService: CookieService,
    private myService: ConfigService,
    private router: Router){

  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: '', 
      password:''
    });
  }

  submit(): void{
    this.myService.authFunc(this.form).subscribe((result) => {
      Emitters.authEmitter.emit(true);
      console.log(result);
      localStorage.setItem('jwt', result['jwt']);
      this.cookieService.set( 'jwt', result['jwt']);
      console.log(result['type']);
      if(result['type'] == "company"){
        console.log(result['type']);
      this.router.navigate(['userview']);
      }
      if(result['type'] == 'client'){
        this.router.navigate(['userview']);
      }
      if(result['type'] == 'driver'){
        this.router.navigate(['driverview']);
      }
    }, (err) => {
      Emitters.authEmitter.emit(false);
    });
  }

}
