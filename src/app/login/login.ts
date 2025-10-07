import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NotificationService } from '../notification/notification-service';
import { AuthenticationService } from './authentication-service';
import { switchMap, take, tap } from 'rxjs';
import { HeaderType } from '../constant/header-type';
import { Staff } from '../staff/data/staff';
import { StaffCrudService } from '../staff/data/staff-crud-service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm !: FormGroup;
  username !: string;
  password !: string;
  hide: boolean = true;
  showLoading: boolean = false;

  constructor(
    private authService: AuthenticationService,
    private staffService: StaffCrudService,
    private notiService: NotificationService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: new FormControl('', { validators: [Validators.required] }),
      password: new FormControl('', { validators: [Validators.required] })
      // password: new FormControl('', { validators: [Validators.required, CustomValidators.validatePassword] })
    })
  }

  login(): void {
    this.showLoading = true;
    const data = this.loginForm.getRawValue();
    // this.authService.login(data).subscribe({
    //   next: res => {
    //     console.log('success');
    //     console.log(res.headers.get('Authorization'));
    //     console.log('All headers: ', res.headers.keys());
    //     console.log('res body: ', res.body);
    //   },
    //   error: err => {
    //     console.log(err);
    //     const message = err.error.statusMessage;
    //     this.notiService.show(message, 'danger');
    //     this.showLoading = false;
    //   }
    // });
    this.authService.login(data).pipe(
      take(1),
      tap({
        next: response => {
          console.log(response.headers.get('Authorization'));
          const token = response.headers.get(HeaderType.AUTHORIZATION).toString().substring(7);
          const message: string = response.body?.data;
          this.notiService.show(message, 'success');
          this.authService.setCurrentToken(token);
        },
        error: err => {
          console.log(err);
          const message = err.error.statusMessage;
          this.notiService.show(message, 'danger');
          this.showLoading = false;
        }
      }),
      switchMap(() => this.staffService.getUserProfile())
      ).subscribe({
      next: res => {
        console.log(res);
        this.showLoading = false;
        // const currentUser: Staff = res.body?.data;
        // console.log(currentUser);
        // this.authService.setCurrentToken(token);
        // this.authService.cacheUser(currentUser);
        // this.notiService.show(res.statusText,"success");
        // this.showLoading = false;
        // this.router.navigate(['/staff']);
      },
      error: res => {
        console.log(res);
        const message = res.error.statusMessage;
        this.notiService.show(message, 'danger');
        this.showLoading = false;
      },
      complete: () => this.showLoading = false
    });
  }

  ngOnDestroy(): void {
  }
}
