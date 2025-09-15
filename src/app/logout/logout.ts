import { Component, ElementRef, ViewChild } from '@angular/core';
import { NotificationService } from '../notification/notification-service';
import { AuthenticationService } from '../login/authentication-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  imports: [],
  templateUrl: './logout.html',
  styleUrl: './logout.css'
})
export class Logout {
  showLoading: boolean = false;
  departmentId!: string;
  @ViewChild('logoutModalTrigger') modalTrigger!: ElementRef;
  @ViewChild('logoutModalClose') modalClose!: ElementRef;

  constructor(
    private router: Router,
    private notiService: NotificationService,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void { }

  openModal(): void {
    this.modalTrigger.nativeElement.click();
  }

  // closeModal(): void {
  //   this.deleteModal.nativeElement.modal('hide');
  // }

  logOut() {
    if (this.authService.isLoggedIn()) {
      this.authService.logOut().subscribe(
        {
          next: response => {
            //  this.showLoading = false;
            console.log(response);
            //  this.notiService.show(response.statusMessage,'success');
            this.authService.clearLocalStorage();
            this.notiService.show('You have been logged out successfully', 'success');
            this.router.navigate(['/']);
            this.modalClose.nativeElement.click();
            this.modalTrigger.nativeElement.focus();
          },
          error: response => {
            //  this.showLoading = false;
            console.log(response);
            //  this.notiService.show(response.error.statusMessage,'danger');
          }        }
      );
    }
  }

}
