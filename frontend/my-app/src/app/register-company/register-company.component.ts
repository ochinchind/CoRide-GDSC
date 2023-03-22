import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigService } from '../config.service';

@Component({
  selector: 'app-register-company',
  templateUrl: './register-company.component.html',
  styleUrls: ['./register-company.component.css']
})
export class RegisterCompanyComponent {
  errors?:any;
  form!: FormGroup;
  constructor(private formBuilder: FormBuilder, private myService: ConfigService,
    private router: Router){

  }
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: '', 
      email: '',
      password: ''
    })
  }

  submit():void {
    if(this.confirmvalidator()){
    this.myService.postCompany(this.form).subscribe({
      next: ()=>{this.router.navigate(['/login']);}
    })} else {
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
