import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowDataComponent } from './show-data/show-data.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { AuthComponent } from './auth/auth.component';
import { RegisterComponent } from './register/register.component';
import { UserviewComponent } from './userview/userview.component';
import { RegisterDriverComponent } from './register-driver/register-driver.component';
import { RegisterCompanyComponent } from './register-company/register-company.component';
import { DriverviewComponent } from './driverview/driverview.component';

const routes: Routes = [
  { path: 'show-data', component: ShowDataComponent },
  { path: 'userview', component: UserviewComponent },
  { path: 'driverview', component: DriverviewComponent },
  { path: 'login', component: AuthComponent },
  { path: 'register/client', component: RegisterComponent },
  { path: 'register/driver', component: RegisterDriverComponent },
  { path: 'register/company', component: RegisterCompanyComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: PagenotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
