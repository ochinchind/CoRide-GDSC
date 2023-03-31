import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ConfigService } from '../config.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  errors? : string;
  form!: FormGroup;

  constructor(private formBuilder: FormBuilder, private myService: ConfigService,
    private router: Router){

  }
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      firstname: '', 
      lastname: '', 
      email:'',
      phone: '',
      password: '',
      company: '',
    })
  }

  submit():void {
      if(this.confirmvalidator()){
      this.myService.postClient(this.form).subscribe({
        next: ()=>{
          // Pass a success message to the /login route
          const navigationExtras: NavigationExtras = {
            queryParams: { registrationSuccess: true }
          };
          this.router.navigate(['/login'], navigationExtras);
        }
      })
    } else {
      this.errors="password dont match";
    }
  }
  confirmvalidator():boolean{
    var password = this.form.get("password")?.value;
    var repeatpass = (document.getElementById('repeatPass') as HTMLInputElement).value;
    console.log(this.form.getRawValue());
    if(password != repeatpass){
      return false;
    }

    return true;
  }


}
