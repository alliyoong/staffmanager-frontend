import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { AppHttpResponse } from '../../../app-http-response';
import { Attendance } from './attendance';

@Injectable({
  providedIn: 'root'
})
export class CheckInOutService {
  baseUrl: string = 'http://localhost:8088/api/attendance';
  
  constructor(private http: HttpClient) { }
  
  checkIn(staffId: number): Observable<AppHttpResponse>{
    console.log('what the hell: ',staffId);
    return this.http.get<AppHttpResponse>(`${this.baseUrl}/check-in/${staffId}`); 
  }

  checkOut(staffId: number): Observable<AppHttpResponse>{
    return this.http.get<AppHttpResponse>(`${this.baseUrl}/check-out/${staffId}`);
  }
  
  getAttendance(staffId: number): Observable<Attendance>{
    return this.http.get<AppHttpResponse>(`${this.baseUrl}/${staffId}`)
    .pipe(
      map(response => response.data),
      shareReplay(1)
    );
  }
}
