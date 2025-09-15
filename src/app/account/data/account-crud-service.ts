import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { AppHttpResponse } from '../../app-http-response';
import { Account } from './account';

@Injectable({
  providedIn: 'root'
})
export class AccountCrudService {
  baseUrl: string = 'http://localhost:8088/api/account';

  constructor(private http: HttpClient) { }

  add(data: any): Observable<AppHttpResponse> {
    return this.http.post<AppHttpResponse>(this.baseUrl, data);
  }

  update(data: any, id: number): Observable<AppHttpResponse> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put<AppHttpResponse>(url, data);
  }

  delete(id: string): Observable<AppHttpResponse> {
    return this.http.delete<AppHttpResponse>(`${this.baseUrl}/${id}`);
  }
  
  getStatusOptions(): Observable<string[]> {
    return this.http.get<AppHttpResponse>(`${this.baseUrl}/status`).pipe(
        map(response => response.data),
        shareReplay(1)
      );
  }
  
}
