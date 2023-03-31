import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigService } from '../config.service';
import { CookieService } from 'ngx-cookie-service';
import { Emitters } from '../emitters/emitters';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  success:any;
  form: FormGroup = this.formBuilder.group({
    email: ['', Validators.compose([Validators.required, Validators.email])],
    password: ['', Validators.required]
  });

  constructor(private formBuilder: FormBuilder,private cookieService: CookieService,
    private myService: ConfigService,
    private router: Router, 
    private route: ActivatedRoute){

  }

  ngOnInit(): void {
    this.myService.getUser().subscribe((data)=>{
      Emitters.authEmitter.emit(true);
      console.log(data);
      if(data['type'] == 'driver'){
        this.router.navigate(['driverview']);
      } else if(data['type'] == 'company'){
        this.router.navigate(['companyview']);
      } else if(data['type'] == 'client'){
        this.router.navigate(['userview']);
      }
    }, (err)=>{
      console.log(err);
      Emitters.authEmitter.emit(false);
    });

    this.form = this.formBuilder.group({
      email: '', 
      password:''
    });
    const registrationSuccess = this.route.snapshot.queryParams['registrationSuccess'];
    if (registrationSuccess) {
      // Display a success message
      this.success = "Registration was successful!";
    }




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
      if(result['type'] == "client"){
        this.router.navigate(['userview']);
      }
      if(result['type'] == "driver"){
        this.router.navigate(['driverview']);
      }
    }, (err) => {
      Emitters.authEmitter.emit(false);
    });
  }

}
