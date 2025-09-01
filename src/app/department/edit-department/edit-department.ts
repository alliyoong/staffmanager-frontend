import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NotificationService } from '../../notification/notification-service';
import { DepartmentCrudService } from '../data/department-crud-service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-department',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './edit-department.html',
  styleUrl: './edit-department.css'
})
export class EditDepartment implements OnInit{
  showLoading: boolean = false;
  departmentId!: string;
  editDepartmentForm!: FormGroup;
  hide: boolean = true;
  @ViewChild('editModalTrigger') modalTrigger!: ElementRef;

  constructor(
    private activatedRoute: ActivatedRoute, 
    private notiService: NotificationService, 
    private formBuilder: FormBuilder,
    private departmentService: DepartmentCrudService
  ){}

  
  openModal(): void {
    this.modalTrigger.nativeElement.click();
  }


  ngOnInit(): void {
    this.editDepartmentForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    });
  }

  resetForm(): void{
    this.editDepartmentForm.reset({
      name:'',
      description: '',
    });
    this.editDepartmentForm.markAsPristine();
  }
  
  editDepartment(){
    const data = this.editDepartmentForm.getRawValue();
    let param = this.activatedRoute.firstChild?.snapshot.paramMap.get('departmentId');
    if(param){
      this.departmentId = param;
    }
    this.departmentService.update(data, this.departmentId).subscribe({
       next: response => {
           this.showLoading = false;
           this.notiService.show(response.statusMessage,'success');
          //  this.dialogRef.close({message: 'success'});
       },
       error: response => {
           this.showLoading = false;
           this.notiService.show(response.statusMessage,'danger');
       },
       complete: () => { 
        this.showLoading = false ;
        // this.dialogRef.close();
      }
    });
  }
}
