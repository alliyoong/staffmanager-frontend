import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Logout } from '../logout/logout';
import { AuthenticationService } from '../login/authentication-service';
import { NotificationService } from '../notification/notification-service';
import { CommonModule } from '@angular/common';
import { SearchService } from '../staff/data/search-service';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-navigation-bar',
  imports: [
    RouterModule,
    Logout
  ],
  templateUrl: './navigation-bar.html',
  styleUrl: './navigation-bar.css'
})
export class NavigationBar implements OnInit {
  @ViewChild(Logout) logoutModal!: Logout;
  isAuthenticated: boolean = false;
  username: string = '';

  constructor(
    private route: Router,
    private authService: OidcSecurityService,
    private notiService: NotificationService,
    private searchService: SearchService
  ) { }

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(
      ({isAuthenticated}) => {
        this.isAuthenticated = isAuthenticated;
      }
    )
    this.authService.userData$.subscribe(
      ({userData}) => {
        if (userData) {
          this.username = userData.preferred_username;
        }
      }
    )
  }

  login(): void {
    this.authService.logoffLocal();
    sessionStorage.clear();
    this.authService.authorize();
  }

  logout(): void {
    this.authService.logoff()
    .subscribe({
      next: result => {
        console.log(result);
        this.notiService.show('You have been logged out', 'success');
        this.route.navigate(['/login']);
      },
      error: err => {
        console.log(err);
        this.notiService.show('Logout failed', 'danger');
      }
    })
  }
  
  onSearch(data: string): void {
    this.searchService.setTerm(data);
  }
}
