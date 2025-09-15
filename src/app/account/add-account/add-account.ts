import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '../../notification/notification-service';
import { CommonModule } from '@angular/common';
import { AccountCrudService } from '../data/account-crud-service';
import { Observable } from 'rxjs';
import { Staff } from '../../staff/data/staff';

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
  status$!: Observable<string[]>;
  @ViewChild('addAccountTrigger') modalTrigger!: ElementRef;
  @Input('receivedStaff') targetStaff!: Staff;

  constructor(
    private formBuilder: FormBuilder,
    private service: AccountCrudService,
    private notiService: NotificationService
  ){}
  
  ngOnInit(): void {
    this.addAccountForm = this.formBuilder.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      accountStatus: new FormControl('', [Validators.required]),
      staffId: new FormControl({value: '', disabled: true}, [Validators.required]),
    });

    this.status$ = this.service.getStatusOptions();
  }
  
  ngOnChanges(changes: SimpleChanges): void{
    if(changes['targetStaff'] && changes['targetStaff'].currentValue){
      this.addAccountForm.get('staffId')!.setValue(changes['targetStaff'].currentValue.staffId);
    }
  }

  addAccount(){
    this.showLoading = true;
    const accountData = this.addAccountForm.getRawValue();
    console.log('final data: ', accountData);
    this.service.add(accountData).subscribe({
      next: res => {
        this.showLoading = false;
        this.notiService.show('Account added successfully', 'success');
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
  }

  openModal(): void {
    this.modalTrigger.nativeElement.click();
  }

  resetForm(): void{
    this.addAccountForm.reset();
    this.addAccountForm.markAsPristine();
  }
}
