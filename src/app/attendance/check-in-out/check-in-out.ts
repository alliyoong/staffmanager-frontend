import { Component, effect, signal } from '@angular/core';
import { AuthenticationService } from '../../login/authentication-service';
import { Staff } from '../../staff/data/staff';
import { NotificationService } from '../../notification/notification-service';
import { CheckInOutService } from './data/check-in-out-service';
import { Observable } from 'rxjs';
import { Attendance } from './data/attendance';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-check-in-out',
  imports: [CommonModule, FormsModule],
  templateUrl: './check-in-out.html',
  styleUrl: './check-in-out.css'
})
export class CheckInOut {
  currentUser: Staff | null = null;
  attendance$: Observable<Attendance> = new Observable<Attendance>();
  currentPage: number = 0;
  pageSize: number = 10;
  searchCriteria = signal<any>({});

  constructor(
    private authService: AuthenticationService,
    private notiService: NotificationService,
    private checkInOutService: CheckInOutService
  ) {
    this.currentUser = this.authService.getCurrentUser();
    this.attendance$ = this.checkInOutService.getPage(this.searchCriteria);
    this.searchCriteria.set({
      staffId: this.currentUser?.staffId,
      pageNumber: 0,
      pageSize: 10,
      fromDate: new Date(),
      toDate: new Date()
    });
    console.log(this.searchCriteria());
    effect(() => {
      this.loadAttendance();
    });
  }

  ngOnInit(): void {
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

  loadAttendance(): void {
    let data = this.searchCriteria();
    if(data.fromDate){
      data.fromDate = data.fromDate.toISOString().split('T')[0];
    }
    if(data.toDate){
      data.toDate = data.toDate.toISOString().split('T')[0];
    }
    this.attendance$ = this.checkInOutService.getPage(data)
      .pipe(
      // catchError(err => {
      //   this._notiService.show(err.error.text, 'danger');
      //   throw err;
      // })
    );
  }

  nextPage(totalPages: number) {
    if (this.searchCriteria().pageNumber < totalPages - 1) {
      this.searchCriteria().pageNumber++;
      this.loadAttendance();
    }
  }

  prevPage() {
    if (this.searchCriteria().pageNumber > 0) {
      this.searchCriteria().pageNumber--;
      this.loadAttendance();
    }
  }

  applyFilter(values: any): void {
    console.log(values);
    if (values.fromDate && values.toDate && values.fromDate > values.toDate) {
      this.notiService.show('From date should be less than to date', 'danger');
      return;
    }
    const search = {
      staffId: this.currentUser!.staffId,
      pageNumber: 0,
      pageSize: 10,
      fromDate: values.fromDate,
      toDate: values.toDate
    };
    this.searchCriteria.set(search);
  }

  clearFilter(form: NgForm): void {
    form.reset();
  }

}
