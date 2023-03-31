import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { JwtModule } from "@auth0/angular-jwt";
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShowDataComponent } from './show-data/show-data.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { AuthComponent } from './auth/auth.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { UserviewComponent } from './userview/userview.component';
import { RegisterDriverComponent } from './register-driver/register-driver.component';
import { RegisterCompanyComponent } from './register-company/register-company.component';
import { DriverviewComponent } from './driverview/driverview.component';
import { WebsocketService } from './websocket.service';
import { ChatService } from './chat.service';
import { CompanyviewComponent } from './companyview/companyview.component';
import { UserprofileComponent } from './userprofile/userprofile.component';

export function tokenGetter() {
  return localStorage.getItem("jwt");
}
@NgModule({
  declarations: [
    AppComponent,
    ShowDataComponent,
    PagenotfoundComponent,
    AuthComponent,
    RegisterComponent,
    UserviewComponent,
    RegisterDriverComponent,
    RegisterCompanyComponent,
    DriverviewComponent,
    CompanyviewComponent,
    UserprofileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    GoogleMapsModule,
    FormsModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["127.0.0.1:8000", "http://localhost:4200/", "http://127.0.0.1:8000/getUser/"],
        disallowedRoutes: [],
      },
    })
  ],
  providers: [WebsocketService, ChatService],
  bootstrap: [AppComponent]
})
export class AppModule { }