import { Injectable } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private url = 'http://127.0.0.1:8000/getData/';
  private auth = 'http://127.0.0.1:8000/auth/';
  private logout_url = 'http://127.0.0.1:8000/logout/';
  private getuser = 'http://127.0.0.1:8000/getUser/';
  private postcompany = 'http://127.0.0.1:8000/postCompanies/';
  private postclient_url = 'http://127.0.0.1:8000/postClients/';
  private getclient_url = 'http://127.0.0.1:8000/getClients/';
  private postdriver_url = 'http://127.0.0.1:8000/postDrivers/';
  private postroute_url = 'http://127.0.0.1:8000/postRoutes/';
  private getroute_url = 'http://127.0.0.1:8000/getRoutes/';
  private deleteroute_url = 'http://127.0.0.1:8000/deleteRoutes/';

  constructor(private http: HttpClient, private cookieService:CookieService) {
    
   }

  getData(): Observable<any> {
    return this.http.get<any>(this.url);
  }

  logout(): Observable<any>{
    localStorage.removeItem('jwt');
    this.cookieService.delete('jwt');
    return this.http.post(this.logout_url, {}, {withCredentials: true});
  }

  authFunc(form: FormGroup): Observable<any> {
    return this.http.post(this.auth, form.getRawValue(), {
      withCredentials: true,
    });
  }

  getUser(): Observable<any> {
    return this.http.get(this.getuser, {withCredentials: true});
  }

  postCompany(form: FormGroup): Observable<any> {
    return this.http.post(this.postcompany, form.getRawValue());
  }
  getClients(): Observable<any> {
    return this.http.get(this.getclient_url);
  }
  postClient(form: FormGroup): Observable<any> {
    return this.http.post(this.postclient_url, form.getRawValue());
  }
  postDriver(form: FormGroup): Observable<any> {
    return this.http.post(this.postdriver_url, form.getRawValue());
  }

  postRoute(from :any, dest :any, distance :any, time :any , id:any):Observable<any> {

    return this.http.post(this.postroute_url, {initial_address: from, end_address: dest,length_metres: distance,length_time: time, client_id: id, active:1});
  }

  deleteRoute(id:any):Observable<any> {

    return this.http.post(this.deleteroute_url, {id: id});
  }

  getRoute():Observable<any> {

    return this.http.get(this.getroute_url);
  }




}
