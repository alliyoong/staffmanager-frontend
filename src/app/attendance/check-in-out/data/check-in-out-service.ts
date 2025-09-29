import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, map, Observable, shareReplay } from 'rxjs';
import { AppHttpResponse } from '../../../app-http-response';
import { Attendance } from './attendance';

@Injectable({
  providedIn: 'root'
})
export class CheckInOutService {
  baseUrl: string = 'http://localhost:8088/api/attendance';

  constructor(private http: HttpClient) { }

  checkIn(staffId: number): Observable<AppHttpResponse> {
    return this.http.get<AppHttpResponse>(`${this.baseUrl}/check-in/${staffId}`);
  }

  checkOut(staffId: number): Observable<AppHttpResponse> {
    return this.http.get<AppHttpResponse>(`${this.baseUrl}/check-out/${staffId}`);
  }

  getPage(criteria: any): Observable<Attendance> {
    const url = `${this.baseUrl}/${criteria.staffId}
    ?page=${criteria.pageNumber}
    &size=${criteria.pageSize}
    &fromDate=${criteria.fromDate!}
    &toDate=${criteria.toDate!}
    `;
    return this.http.get<AppHttpResponse>(url)
      .pipe(
        map(response => response.data),
        shareReplay(1)
      );
  }
}
