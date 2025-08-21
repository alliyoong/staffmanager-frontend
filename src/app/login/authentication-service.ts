import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppHttpResponse } from '../app-http-response';
import { HttpClient } from '@angular/common/http';
import { Account } from './data/account';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Staff } from '../staff/data/staff';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  baseUrl: string = 'http://localhost:8088';
  private loggedInUsername!: string | null;
  private accessToken!: string | null;
  private currentAccount!: Staff;
  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) { }

  login(data: any): Observable<any>{
    return this.http.post<AppHttpResponse>(`${this.baseUrl}/login`, data, {
      observe: 'response'
    });
  }

  logOut(): void {}
  
  setCurrentToken(token: string): void {
    this.accessToken = token;
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

  mapMessAccountToUser(staff: Staff): Account {
    let user: { [k: string]: any } = {};
    let key: keyof Staff;
    for (key in staff) {
      if (key !== 'id') {
        user = {
          ...user,
          [key]: staff[key]
        }
      }
    }
    user['userId'] = staff.id;
    return user as Account;
  }

  getCurrentToken(): string {
    return this.accessToken!;
  }

  isLoggedIn(): boolean {
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

  // isContainUser(toCheck: Account, list: Account[]): boolean {
  //   return !!list.find(user => user.userId === toCheck.userId);
  // }
  
}
