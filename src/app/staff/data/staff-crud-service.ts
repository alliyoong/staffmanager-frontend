import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, shareReplay, tap } from 'rxjs';
import { Staff } from './staff';
import { AppHttpResponse } from '../../app-http-response';
import { Page } from './page';

@Injectable({
  providedIn: 'root'
})
export class StaffCrudService {
  baseUrl: string = 'http://localhost:8088/api/staff';

  constructor(private http: HttpClient) { }

  getPage(page: number, size: number): Observable<Page<Staff>> {
    return this.http.get<AppHttpResponse>(`${this.baseUrl}?page=${page}&size=${size}`)
    .pipe(
      map(response => response.data),
      shareReplay(1)
    );
  }

  getList(): Observable<Staff[]> {
    return this.http.get<AppHttpResponse>(this.baseUrl,
      {}).pipe(
        // tap(response => console.log('staff observable ', response)),
        map(response => response.data),
        shareReplay(1)
      );
  }

  add(data: any): Observable<AppHttpResponse> {
    return this.http.post<AppHttpResponse>(this.baseUrl, data);
  }

  update(data: any, id: string): Observable<AppHttpResponse> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put<AppHttpResponse>(url, data);
  }

  delete(id: string): Observable<AppHttpResponse> {
    return this.http.delete<AppHttpResponse>(`${this.baseUrl}/${id}`);
  }

}
