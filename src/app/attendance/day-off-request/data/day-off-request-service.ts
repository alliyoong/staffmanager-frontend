import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppHttpResponse } from '../../../app-http-response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DayOffRequestService {
  baseUrl: string = 'http://localhost:8088/api/day-off-request';

  constructor(private http: HttpClient) { }

  create(data: any): Observable<AppHttpResponse> {
    return this.http.post<AppHttpResponse>(`${this.baseUrl}`, data);
  }
}
