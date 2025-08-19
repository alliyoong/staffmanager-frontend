import { Component } from '@angular/core';
import { Alert } from './alert';
import { NotificationService } from './notification-service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-notification',
  imports: [
    CommonModule
  ],
  templateUrl: './notification.html',
  styleUrl: './notification.css'
})
export class Notification {
  constructor(public notificationService: NotificationService) { }

}
