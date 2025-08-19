import { HttpClient } from '@angular/common/http';
import { Injectable, ResourceRef } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AppHttpResponse } from '../../app-http-response';
import { map, Observable, shareReplay, Subscription } from 'rxjs';
import { Department } from './department';

@Injectable({
  providedIn: 'root'
})
export class DepartmentCrudService {
  baseUrl: string = 'http://localhost:8088/api/department';
  
  constructor(private http: HttpClient) { }

  getList() : Observable<Department[]>{
    return this.http.get<AppHttpResponse>(this.baseUrl,
    {}).pipe(
      map(response => response.data),
      shareReplay(1)
    );
  }

  add(data: any) : Observable<AppHttpResponse>{
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
