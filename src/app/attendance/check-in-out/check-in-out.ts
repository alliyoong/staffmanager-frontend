import { Component } from '@angular/core';
import { AuthenticationService } from '../../login/authentication-service';
import { Staff } from '../../staff/data/staff';
import { NotificationService } from '../../notification/notification-service';
import { CheckInOutService } from '../data/check-in-out-service';

@Component({
  selector: 'app-check-in-out',
  imports: [],
  templateUrl: './check-in-out.html',
  styleUrl: './check-in-out.css'
})
export class CheckInOut {
  currentUser: Staff | null = null;
  constructor(
    private authService: AuthenticationService, 
    private notiService: NotificationService,
    private checkInOutService: CheckInOutService
  ){}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  checkIn(): void {
    this.checkInOutService.checkIn(this.currentUser!.id).subscribe({
      next: res => {
        console.log(res);
        this.notiService.show(res.statusMessage, 'success');
      },
      error: res => {
        console.log(res);
        const message = res.error.statusMessage;
        this.notiService.show(message, 'danger');
      }
    });
  }

  checkOut(): void {
    this.checkInOutService.checkOut(this.currentUser!.id).subscribe({
      next: res => {
        console.log(res);
        this.notiService.show(res.statusMessage, 'success');
      },
      error: res => {
        console.log(res);
        const message = res.error.statusMessage;
        this.notiService.show(message, 'danger');
      }
    });
  }

}
