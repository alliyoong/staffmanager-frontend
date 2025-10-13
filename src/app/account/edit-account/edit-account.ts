import { input, Component, ElementRef, ViewChild, effect, Input, SimpleChanges, OnChanges } from '@angular/core';
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
    CommonModule,
  ],
  templateUrl: './edit-account.html',
  styleUrl: './edit-account.css'
})
export class EditAccount{
  editAccountForm!: FormGroup;
  showLoading: boolean = false;
  hide: boolean = true;
  status$!: Observable<string[]>;
  toEdit!: Account;
  readonly receivedAccount = input<Account | null>();
  // @Input('receivedAccount') targetAccount!: Account | null;
  @ViewChild('editAccountTrigger') modalTrigger!: ElementRef;
  @ViewChild('editAccountClose') modalClose!: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private service: AccountCrudService,
    private notiService: NotificationService
  ) {

    this.editAccountForm = this.formBuilder.group({
      username: new FormControl({ value: '', disabled: true }, [Validators.required]),
      password: new FormControl('', [Validators.required]),
      accountStatus: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      // lastLoginDateDisplay: new FormControl('', [Validators.required]),
      createdAt: new FormControl({value: '', disabled: true}, [Validators.required])
    });

    this.status$ = this.service.getStatusOptions();
    effect(() => {
      const val = this.receivedAccount();
      if (val) {
        this.toEdit = val!;
        this.editAccountForm.patchValue({
          username: this.toEdit.username,
          accountStatus: this.toEdit.accountStatus,
          firstName: this.toEdit.firstName,
          lastName: this.toEdit.lastName,
          email: this.toEdit.email,
          // lastLoginDateDisplay: this.toEdit.lastLoginDateDisplay,
          createdAt: new Date(this.toEdit.createdAt)
        });
      }
    });
  }

  ngOnInit(): void { }

  editAccount() {
    this.showLoading = true;
    const accountData = this.editAccountForm.getRawValue();
    if (!this.editAccountForm.get('password')!.value) {
      accountData.password = this.toEdit.password;
    } else { }
    console.log('final data: ', accountData);
    this.service.update(accountData, this.toEdit.userId).subscribe({
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

  resetForm(): void {
    this.editAccountForm.reset();
    this.editAccountForm.markAsPristine();
  }
}
