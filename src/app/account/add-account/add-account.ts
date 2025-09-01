import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '../../notification/notification-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-account',
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './add-account.html',
  styleUrl: './add-account.css'
})
export class AddAccount {
  addAccountForm!: FormGroup;
  showLoading: boolean = false;
  hide: boolean = true;
  constructor(
    private formBuilder: FormBuilder,
    private notiService: NotificationService
  ){}
  
  ngOnInit(): void {
    this.addAccountForm = this.formBuilder.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  addAccount(){
    this.showLoading = true;
    const accountData = this.addAccountForm.getRawValue();
    console.log('final data: ', accountData);

    this.showLoading = false;
    this.notiService.show('Account added successfully', 'success');
    this.resetForm();
  }

  resetForm(): void{
    this.addAccountForm.reset();
    this.addAccountForm.markAsPristine();
  }
}
