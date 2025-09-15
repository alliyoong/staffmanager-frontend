import { Component } from '@angular/core';
import { AuthenticationService } from '../../login/authentication-service';
import { Staff } from '../../staff/data/staff';
import { NotificationService } from '../../notification/notification-service';
import { CheckInOutService } from './data/check-in-out-service';
import { Observable } from 'rxjs';
import { AppHttpResponse } from '../../app-http-response';
import { Attendance } from './data/attendance';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-check-in-out',
  imports: [CommonModule],
  templateUrl: './check-in-out.html',
  styleUrl: './check-in-out.css'
})
export class CheckInOut {
  currentUser: Staff | null = null;
  attendance$: Observable<Attendance> = new Observable<Attendance>();

  constructor(
    private authService: AuthenticationService, 
    private notiService: NotificationService,
    private checkInOutService: CheckInOutService
  ){}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.attendance$ = this.checkInOutService.getAttendance(this.currentUser!.staffId);
  }

  checkIn(): void {
    this.checkInOutService.checkIn(this.currentUser!.staffId).subscribe({
      next: res => {
        console.log(res);
        this.notiService.show('Check in successful', 'success');
      },
      error: res => {
        console.log(res);
        const message = res.error.statusMessage;
        this.notiService.show(message, 'danger');
      }
    });
  }

  checkOut(): void {
    this.checkInOutService.checkOut(this.currentUser!.staffId).subscribe({
      next: res => {
        console.log(res);
        this.notiService.show('Check out successful', 'success');
      },
      error: res => {
        console.log(res);
        const message = res.error.statusMessage;
        this.notiService.show(message, 'danger');
      }
    });
  }

}
