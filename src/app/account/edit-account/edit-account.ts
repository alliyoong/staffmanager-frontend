import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '../../notification/notification-service';
import { AccountCrudService } from '../data/account-crud-service';
import { Staff } from '../../staff/data/staff';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Account } from '../data/account';

@Component({
  selector: 'app-edit-account',
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './edit-account.html',
  styleUrl: './edit-account.css'
})
export class EditAccount {
  editAccountForm!: FormGroup;
  showLoading: boolean = false;
  hide: boolean = true;
  status$!: Observable<string[]>;
  toEdit!: Account;
  @Input('receivedStaff') target!: Staff;
  @ViewChild('editAccountTrigger') modalTrigger!: ElementRef;
  @ViewChild('editAccountClose') modalClose!: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private service: AccountCrudService,
    private notiService: NotificationService
  ){
    
    this.editAccountForm = this.formBuilder.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      accountStatus: new FormControl('', [Validators.required]),
      lastLoginDateDisplay: new FormControl('', [Validators.required]),
      createdAt: new FormControl('', [Validators.required])
    });

    this.status$ = this.service.getStatusOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['target'] && changes['target'].currentValue) {
      this.toEdit = changes['target'].currentValue.account;
      console.log(this.toEdit);
      this.editAccountForm.patchValue({
        username: this.toEdit.username,
        accountStatus: this.toEdit.accountStatus,
        lastLoginDateDisplay: this.toEdit.lastLoginDateDisplay, 
        createdAt: this.toEdit.createdAt
      });
    } else {
      this.resetForm();
    }
  }
  
  ngOnInit(): void {}

  editAccount(){
    this.showLoading = true;
    const accountData = this.editAccountForm.getRawValue();
    if(!this.editAccountForm.get('password')!.value){
      accountData.password = this.toEdit.password;
    } else {}
    console.log('final data: ', accountData);
    this.service.update(accountData, this.toEdit.accountId).subscribe({
      next: res => {
        this.showLoading = false;
        this.notiService.show('Account updated successfully', 'success');
        this.resetForm();
      },
      error: res => {
        this.showLoading = false;
        this.notiService.show(res.error.statusMessage, 'danger');
        // this.resetForm();
      },
      complete: () => this.showLoading = false
    });

    this.showLoading = false;
    this.notiService.show('Account updated successfully', 'success');
    this.modalClose.nativeElement.click();
    // this.resetForm();
  }

  openModal(): void {
    this.modalTrigger.nativeElement.click();
  }

  resetForm(): void{
    this.editAccountForm.reset();
    this.editAccountForm.markAsPristine();
  }
}
