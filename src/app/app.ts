import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationBar } from './navigation-bar/navigation-bar';
import { Notification } from './notification/notification';
import { DeleteDepartment } from './department/delete-department/delete-department';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavigationBar,
    Notification,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('staff_manager_frontend');
}
