import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigService } from '../config.service';

@Component({
  selector: 'app-register-driver',
  templateUrl: './register-driver.component.html',
  styleUrls: ['./register-driver.component.css']
})
export class RegisterDriverComponent {
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
      car: '',
      CarClass:''
    })
  }

  submit():void {
      if(this.confirmvalidator()){
      this.myService.postDriver(this.form).subscribe({
        next: ()=>{this.router.navigate(['/login']);}
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

  dropdownset(val:any){
    console.log(val);
    if(val!=""){
      this.form.patchValue({
        CarClass:val
      });
      const inp = document.getElementById('carclass') as HTMLInputElement;
      inp.value = val;
    }
  }


}
