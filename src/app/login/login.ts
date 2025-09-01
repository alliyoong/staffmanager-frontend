import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NotificationService } from '../notification/notification-service';
import { AuthenticationService } from './authentication-service';
import { take } from 'rxjs';
import { HeaderType } from '../constant/header-type';
import { Staff } from '../staff/data/staff';

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
    this.authService.login(data).pipe(take(1)).subscribe({
      next: res => {
        console.log(res);
        const token = res.headers.get(HeaderType.AUTHORIZATION).toString().substring(7);
        const currentUser: Staff = res.body?.data;
        console.log(currentUser);
        this.authService.setCurrentToken(token);
        this.authService.cacheUser(currentUser);
        this.notiService.show(res.statusText,"success");
        this.showLoading = false;
        this.router.navigate(['/staff']);
      },
      error: res => {
        console.log(res);
        const message = res.error.statusMessage;
        this.notiService.show(message, 'danger');
        this.showLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
  }
}
