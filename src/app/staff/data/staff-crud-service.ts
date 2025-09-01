import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, shareReplay, tap } from 'rxjs';
import { Staff } from './staff';
import { AppHttpResponse } from '../../app-http-response';
import { Page } from './page';
import { Department } from '../../department/data/department';
import { Account } from '../../account/data/account';

@Injectable({
  providedIn: 'root'
})
export class StaffCrudService {
  baseUrl: string = 'http://localhost:8088/api/staff';

  constructor(private http: HttpClient) { }

  getPage(page: number, size: number, search: string): Observable<Page<Staff>> {
    return this.http.get<AppHttpResponse>(`${this.baseUrl}?page=${page}&size=${size}&search=${search}`)
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
    return this.http.post<AppHttpResponse>('http://localhost:8088/api/auth/register', data);
  }

  update(data: any, id: string): Observable<AppHttpResponse> {
    const url = `http://localhost:8088/api/auth/edit-account/${id}`;
    return this.http.put<AppHttpResponse>(url, data);
  }

  updateAccount(data: any, id: string): Observable<AppHttpResponse> {
    const url = `/${id}`;
    return this.http.put<AppHttpResponse>(url, data);
  }

  delete(id: string): Observable<AppHttpResponse> {
    return this.http.delete<AppHttpResponse>(`${this.baseUrl}/${id}`);
  }
  
  checkHasAccount(staffId: number): Observable<Account>{
    return this.http.get<AppHttpResponse>(`${this.baseUrl}/check-has-account/${staffId}`)
    .pipe(
        tap(response => console.log('check if has account observable ', response)),
        map(response => response.data)
    );
  }

  getDepartmentOptions(): Observable<Department[]> {
    return this.http.get<AppHttpResponse>('http://localhost:8088/api/department').pipe(
        // tap(response => console.log('staff observable ', response)),
        map(response => response.data),
        shareReplay(1)
      );
  }
  getGenderOptions(): Observable<string[]> {
    return this.http.get<AppHttpResponse>('http://localhost:8088/api/staff/gender').pipe(
        // tap(response => console.log('staff observable ', response)),
        map(response => response.data),
        shareReplay(1)
      );
  }
  getStatusOptions(): Observable<string[]> {
    return this.http.get<AppHttpResponse>('http://localhost:8088/api/staff/status').pipe(
        // tap(response => console.log('staff observable ', response)),
        map(response => response.data),
        shareReplay(1)
      );
  }
}
