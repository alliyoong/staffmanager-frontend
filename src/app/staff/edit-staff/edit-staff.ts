import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NotificationService } from '../../notification/notification-service';
import { Staff } from '../data/staff';
import { Account } from '../../account/data/account';
import { StaffCrudService } from '../data/staff-crud-service';
import { Observable } from 'rxjs';
import { Department } from '../../department/data/department';

@Component({
  selector: 'app-edit-staff',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './edit-staff.html',
  styleUrl: './edit-staff.css'
})
export class EditStaff implements OnChanges {
  showLoading: boolean = false;
  staffId!: string;
  editStaffForm!: FormGroup;
  editAccountForm!: FormGroup;
  hide: boolean = true;
  @ViewChild('editModalTrigger') modalTrigger!: ElementRef;
  @Input('receivedStaff') toEdit!: Staff;
  departments$!: Observable<Department[]>;
  status$!: Observable<string[]>;
  gender$!: Observable<string[]>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private notiService: NotificationService,
    private formBuilder: FormBuilder,
    private staffService: StaffCrudService
  ) {
    this.departments$ = this.staffService.getDepartmentOptions();
    this.status$ = this.staffService.getStatusOptions();
    this.gender$ = this.staffService.getGenderOptions();

    this.editStaffForm = this.formBuilder.group({
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

    this.editAccountForm = this.formBuilder.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['toEdit']) {
      this.editStaffForm.patchValue(changes['toEdit'].currentValue);
      this.editStaffForm.get('departmentId')!.setValue(changes['toEdit'].currentValue.department.departmentId);
      if (changes['toEdit'].currentValue.account) {
        this.editAccountForm.patchValue(changes['toEdit'].currentValue.account);
      } else {
        this.resetForm(this.editAccountForm);
      }
    }
  }

  ngOnInit(): void { }

  openModal(): void {
    this.modalTrigger.nativeElement.click();
  }

  editAccount() {
    const staffData = this.editStaffForm.getRawValue();
    const accountData = this.editAccountForm.getRawValue();
    const data = { ...staffData, ...accountData };
    console.log('final data: ', data);

    let param = this.activatedRoute.firstChild?.snapshot.paramMap.get('staffId');
    if (param) {
      this.staffId = param;
    }

    this.staffService.update(data, this.staffId).subscribe({
      next: response => {
        this.showLoading = false;
        this.notiService.show(response.statusMessage, 'success');
        //  this.dialogRef.close({message: 'success'});
      },
      error: response => {
        this.showLoading = false;
        this.notiService.show(response.statusMessage, 'danger');
      },
      complete: () => {
        this.showLoading = false;
        // this.dialogRef.close();
      }
    });
  }

  resetForm(form: FormGroup): void {
    form.reset();
    form.markAsPristine();
  }
}
