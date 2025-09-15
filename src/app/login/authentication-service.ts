import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AppHttpResponse } from '../app-http-response';
import { HttpClient } from '@angular/common/http';
import { Account } from '../account/data/account';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Staff } from '../staff/data/staff';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  baseUrl: string = 'http://localhost:8088/api/auth';
  private loggedInUsername!: string | null;
  private accessToken!: string | null;
  private currentAccount!: Staff | null;
  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) { }
  
  login(data: Account): Observable<any>{
    return this.http.post<AppHttpResponse>(`${this.baseUrl}/login`, data, {
      withCredentials: true,
      observe: 'response'
    });
  }

  logOut(): Observable<any> {
    return this.http.post<AppHttpResponse>(`${this.baseUrl}/logout`, {}, {
      observe: 'response',
      withCredentials: true
    })
  }
  
  clearLocalStorage(): void {
    this.accessToken = null;
    this.currentAccount = null;
    localStorage.removeItem('app-user');
    localStorage.removeItem('access-token');
  }
  
  setCurrentToken(token: string): void {
    this.accessToken = token;
    localStorage.setItem('access-token', token);
  }

  cacheUser(staff: Staff): void {
    // const user = this.mapMessAccountToUser(staff);
    this.currentAccount = staff;
    localStorage.setItem('app-user', JSON.stringify(this.currentAccount));
  }

  getCurrentUser(): Staff | null {
    if (localStorage.getItem('app-user')) {
      return JSON.parse(localStorage.getItem('app-user')!);
    }
    return null;
  }

  // mapMessAccountToUser(staff: Staff): Account {
  //   let user: { [k: string]: any } = {};
  //   let key: keyof Staff;
  //   for (key in staff) {
  //     if (key !== 'staffId') {
  //       user = {
  //         ...user,
  //         [key]: staff[key]
  //       }
  //     }
  //   }
  //   user['userId'] = staff.id;
  //   return user as Account;
  // }

  getCurrentToken(): string {
    return this.accessToken!;
  }
  
  loadCurrentToken(): void {
    this.accessToken = localStorage.getItem('access-token');
  }

  isLoggedIn(): boolean {
    this.loadCurrentToken();
    if (this.accessToken) {
      if (this.jwtHelper.decodeToken(this.accessToken).sub != null || '') {
        if (!this.jwtHelper.isTokenExpired(this.accessToken)) {
          this.loggedInUsername = this.jwtHelper.decodeToken(this.accessToken).sub;
          return true;
        }
      }
    } else {
      this.logOut();
      return false;
    }
    return false;
  }
  
  refreshToken(): Observable<any> {
    return this.http.post<AppHttpResponse>(`${this.baseUrl}/refresh`, {}, {
      observe: 'response',
      withCredentials: true
    }).pipe(
      // tap(() => { console.log('refresh token called from service') }),
      // catchError(err => {
      //   console.log('refresh token error: ', err);
      //   return throwError(() => err);
      // })
    );
  }

  // isContainUser(toCheck: Account, list: Account[]): boolean {
  //   return !!list.find(user => user.userId === toCheck.userId);
  // }
  
}
