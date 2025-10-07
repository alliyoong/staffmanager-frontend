import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, shareReplay, tap } from 'rxjs';
import { Staff } from './staff';
import { AppHttpResponse } from '../../app-http-response';
import { Page } from './page';
import { Department } from '../../department/data/department';
import { Account } from '../../account/data/account';
import { JobPosition } from '../../job-position/job-position';

@Injectable({
  providedIn: 'root'
})
export class StaffCrudService {
  baseUrl: string = 'http://staff.localhost:8080/api/staff';
  private status$!: Observable<string[]>;
  private gender$!: Observable<string[]>;
  private jobPosition$!: Observable<JobPosition[]>;
  private departments$!: Observable<Department[]>;

  constructor(private http: HttpClient) { }

  // getPage(page: number, size: number, search: any): Observable<Page<Staff>> {
  //   return this.http.get<AppHttpResponse>(`${this.baseUrl}?page=${page}&size=${size}&search=${search}`)
  //   .pipe(
  //     map(response => response.data),
  //     shareReplay(1)
  //   );
  // }

  getPage(search: any): Observable<Page<Staff>> {
    return this.http.post<AppHttpResponse>(`${this.baseUrl}/search`, search, {headers: {'Content-Type': 'application/json'}})
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

  // updateAccount(data: any, id: string): Observable<AppHttpResponse> {
  //   const url = `/${id}`;
  //   return this.http.put<AppHttpResponse>(url, data);
  // }

  delete(id: string): Observable<AppHttpResponse> {
    return this.http.delete<AppHttpResponse>(`${this.baseUrl}/${id}`);
  }
  
  checkHasAccount(staffId: number): Observable<Account>{
    return this.http.get<AppHttpResponse>(`http://account.localhost:8080/api/account/check-has-account/${staffId}`)
    .pipe(
        // tap(response => console.log('check if has account observable ', response)),
        map(response => response.data)
    );
  }

  getDepartmentOptions(): Observable<Department[]> {
    if(!this.departments$){
      this.departments$ = this.http.get<AppHttpResponse>('http://department.localhost:8080/api/department').pipe(
          // tap(response => console.log('staff observable ', response)),
          map(response => response.data),
          shareReplay(1)
        );
    }
    return this.departments$;
  }

  getGenderOptions(): Observable<string[]> {
    if (!this.gender$) {
      this.gender$ = this.http.get<AppHttpResponse>(`${this.baseUrl}/gender`).pipe(
          // tap(response => console.log('staff observable ', response)),
          map(response => response.data),
          shareReplay(1)
        );
    }
    return this.gender$;
  }

  getStatusOptions(): Observable<string[]> {
    if (!this.status$) {
      this.status$ = this.http.get<AppHttpResponse>(`${this.baseUrl}/status`).pipe(
          // tap(response => console.log('staff observable ', response)),
          map(response => response.data),
          shareReplay(1)
        );
    }
    return this.status$;
  }

  getJobPositionOptions(): Observable<JobPosition[]> {
    if (!this.jobPosition$) {
      this.jobPosition$ = this.http.get<AppHttpResponse>(`${this.baseUrl}/job-position`).pipe(
          // tap(response => console.log('staff observable ', response)),
          map(response => response.data),
          shareReplay(1)
        );
    }
    return this.jobPosition$;
  }
  
  getUserProfile(): Observable<Staff> {
    return this.http.get<AppHttpResponse>(`${this.baseUrl}/me`)
    .pipe(
        tap(response => console.log('get user profile observable ', response)),
        map(response => response.data)
    );
  }
}
