import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StaffCrudService } from '../data/staff-crud-service';
import { NotificationService } from '../../notification/notification-service';
import { Observable, take } from 'rxjs';
import { Department } from '../../department/data/department';

@Component({
  selector: 'app-add-staff',
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './add-staff.html',
  styleUrl: './add-staff.css'
})
export class AddStaff {
  addStaffForm!: FormGroup;
  addAccountForm!: FormGroup;
  showLoading: boolean = false;
  hide: boolean = true;
  departments$!: Observable<Department[]>;
  status$!: Observable<string[]>;
  gender$!: Observable<string[]>;

  constructor(
    private _service: StaffCrudService, 
    private formBuilder: FormBuilder,
    private notiSertice: NotificationService
  ){}

  ngOnInit(): void {
    this.addStaffForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      socialSecurityNumber: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      dateOfBirth: new FormControl('', [Validators.required]),
      joinDate: new FormControl('', [Validators.required]),
      departmentId: new FormControl('', [Validators.required]),
      staffStatus: new FormControl('', [Validators.required]),
    });

    this.addAccountForm = this.formBuilder.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
    
    this.departments$ = this._service.getDepartmentOptions();
    this.status$ = this._service.getStatusOptions();
    this.gender$ = this._service.getGenderOptions();
  }

  add(){
    this.showLoading = true;

    const staffData = this.addStaffForm.getRawValue();
    const accountData = this.addAccountForm.getRawValue();
    const data = {...staffData, ...accountData};
    console.log('final data: ', data);

    this._service.add(data).pipe(take(1)).subscribe({
      next: res => {
        this.showLoading = false;
        this.notiSertice.show('Staff added successfully', 'success');
        this.resetForm();
      },
      error: res => {
        this.showLoading = false;
        this.notiSertice.show(res.error.statusMessage, 'danger');
        // this.resetForm();
      },
      complete: () => this.showLoading = false
    });
  }

  resetForm(): void{
    this.addStaffForm.reset();
    this.addStaffForm.markAsPristine();

    this.addAccountForm.reset();
    this.addAccountForm.markAsPristine();
  }
}
