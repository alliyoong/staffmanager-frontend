import { Component, ViewChild } from '@angular/core';
import { Staff } from '../data/staff';
import { Observable, shareReplay } from 'rxjs';
import { StaffCrudService } from '../data/staff-crud-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DeleteStaff } from '../delete-staff/delete-staff';
import { EditStaff } from '../edit-staff/edit-staff';
import { Page } from '../data/page';

@Component({
  selector: 'app-list-staff',
  imports: [
    CommonModule,
    DeleteStaff,
    EditStaff
  ],
  templateUrl: './list-staff.html',
  styleUrl: './list-staff.css'
})
export class ListStaff {
  @ViewChild(DeleteStaff) deleteStaff!: DeleteStaff;
  // @ViewChild(EditDepartment) editDepartment!: EditDepartment;
  staffList$: Observable<Page<Staff>> = new Observable<Page<Staff>>();
  currentPage: number = 0;
  pageSize: number = 10;
  // totalPages: number = 0;

  constructor(private _service: StaffCrudService, private _route: Router) {}

  ngOnInit(): void {
    this.loadStaff();
  }
  loadStaff(page: number = 0) {
    this.currentPage = page;
    this.staffList$ = this._service.getPage(this.currentPage, this.pageSize);
  }

  nextPage(totalPages: number) {
    if (this.currentPage < totalPages - 1) {
      this.loadStaff(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.loadStaff(this.currentPage - 1);
    }
  }
  
  openEdit(data: Staff): void {
    this._route.navigate(['/staff/edit', data.id])
    // this.editDepartment.openModal();
  }
  
  openDelete(data: Staff): void {
    this._route.navigate(['/staff/delete', data.id]);
    this.deleteStaff.openModal();
  }
}
