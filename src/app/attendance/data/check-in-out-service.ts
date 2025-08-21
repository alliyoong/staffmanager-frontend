import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppHttpResponse } from '../../app-http-response';

@Injectable({
  providedIn: 'root'
})
export class CheckInOutService {
  baseUrl: string = 'http://localhost:8088/api';
  
  constructor(private http: HttpClient) { }
  
  checkIn(staffId: number): Observable<any>{
    return this.http.get<AppHttpResponse>(`${this.baseUrl}/check-in/${staffId}`) 
  }

  checkOut(staffId: number): Observable<any>{
    return this.http.get<AppHttpResponse>(`${this.baseUrl}/check-out/${staffId}`) 
  }
}
