import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private url = 'http://127.0.0.1:8000/getData';


  constructor(private http: HttpClient) {
    
   }

  getData(): Observable<any> {
    return this.http.get<any>(this.url);
  }


}
