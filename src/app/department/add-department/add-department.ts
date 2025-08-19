import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DepartmentCrudService } from '../data/department-crud-service';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../notification/notification-service';

@Component({
  selector: 'app-add-department',
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './add-department.html',
  styleUrl: './add-department.css'
})
export class AddDepartment implements OnInit{
  addDepartmentForm!: FormGroup;
  showLoading: boolean = false;
  hide: boolean = true;

  constructor(
    private _service: DepartmentCrudService, 
    private formBuilder: FormBuilder,
    private notiSertice: NotificationService
  ){}

  ngOnInit(): void {
    this.addDepartmentForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    });
  }

  add(){
    this.showLoading = true;
    const data = this.addDepartmentForm.getRawValue();
    console.log(data);
    this._service.add(data).pipe(take(1)).subscribe({
      next: res => { 
         this.showLoading = false;
         this.notiSertice.show('Department added successfully', 'success');
         this.resetForm();
      },
      error: res => {
         this.showLoading = false;
         // this.resetForm();
      },
      complete: () => this.showLoading = false
    }
    );
  }

  resetForm(): void{
    this.addDepartmentForm.reset({
      name:'',
      description: '',
    });
    this.addDepartmentForm.markAsPristine();
  }

}
