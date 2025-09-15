import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Logout } from '../logout/logout';
import { AuthenticationService } from '../login/authentication-service';
import { NotificationService } from '../notification/notification-service';
import { CommonModule } from '@angular/common';
import { SearchService } from '../staff/data/search-service';

@Component({
  selector: 'app-navigation-bar',
  imports: [
    RouterModule,
    Logout
  ],
  templateUrl: './navigation-bar.html',
  styleUrl: './navigation-bar.css'
})
export class NavigationBar {
  @ViewChild(Logout) logoutModal!: Logout;

  constructor(
    private route: Router,
    private authService: AuthenticationService,
    private notiService: NotificationService,
    private searchService: SearchService
  ) { }

  logout(): void {
    if (this.authService.isLoggedIn()) {
      this.logoutModal.openModal();
      this.route.navigate(['/logout']);
    }else {
      this.notiService.show('You haven\'t logged in yet', 'warning');
    }
  }
  
  onSearch(data: string): void {
    this.searchService.setTerm(data);
  }
}
