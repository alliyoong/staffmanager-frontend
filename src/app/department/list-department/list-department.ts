import { Component, OnInit, ViewChild } from '@angular/core';
import { DepartmentCrudService } from '../data/department-crud-service';
import { Department } from '../data/department';
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { DeleteDepartment } from '../delete-department/delete-department';
import { Router } from '@angular/router';
import { EditDepartment } from '../edit-department/edit-department';

@Component({
  selector: 'app-list-department',
  imports: [
    CommonModule,
    DeleteDepartment,
    EditDepartment
  ],
  templateUrl: './list-department.html',
  styleUrl: './list-department.css'
})
export class ListDepartment implements OnInit{
  @ViewChild(DeleteDepartment) deleteDepartment!: DeleteDepartment;
  @ViewChild(EditDepartment) editDepartment!: EditDepartment;
  subcriptions: Subscription[] = [];
  departmentList$: Observable<Department[]> = new Observable<Department[]>();
  isDeleteModalOpen: boolean = false;

  constructor(private _service: DepartmentCrudService, private _route: Router) {}

  ngOnInit(): void {
    this.departmentList$ = this._service.getList();
  }
  
  openEdit(data: Department): void {
    this._route.navigate(['/department/edit', data.departmentId])
    this.editDepartment.openModal();
  }
  
  openDelete(data: Department): void {
    this._route.navigate(['/department/delete', data.departmentId]);
    this.deleteDepartment.openModal();
  }
  
}
