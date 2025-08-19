import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Alert } from './alert';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

private notificationSubject = new BehaviorSubject<Alert | null>(null);
  notification$ = this.notificationSubject.asObservable();

  show(message: string, type: 'success' | 'danger' | 'warning' | 'info' = 'success') {
    this.notificationSubject.next({ message, type });

    // Auto close after 3 seconds
    setTimeout(() => this.clear(), 3000);
  }

  clear() {
    this.notificationSubject.next(null);
  }
}
