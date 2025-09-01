import { Component, effect, ViewChild } from '@angular/core';
import { Staff } from '../data/staff';
import { catchError, Observable, shareReplay, switchMap, tap, of } from 'rxjs';
import { StaffCrudService } from '../data/staff-crud-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DeleteStaff } from '../delete-staff/delete-staff';
import { EditStaff } from '../edit-staff/edit-staff';
import { Page } from '../data/page';
import { NotificationService } from '../../notification/notification-service';
import { SearchService } from '../data/search-service';
import { AddAccount } from "../../account/add-account/add-account";
import { EditAccount } from '../../account/edit-account/edit-account';

@Component({
  selector: 'app-list-staff',
  imports: [
    CommonModule,
    DeleteStaff,
    EditStaff,
    AddAccount,
    EditAccount
],
  templateUrl: './list-staff.html',
  styleUrl: './list-staff.css'
})
export class ListStaff {
  @ViewChild(DeleteStaff) deleteStaff!: DeleteStaff;
  @ViewChild(EditStaff) editStaff!: EditStaff;
  @ViewChild(AddAccount) addAccount!: AddAccount;
  @ViewChild(EditAccount) editAccount!: EditAccount;
  selectedStaff!: Staff;
  staffList$: Observable<Page<Staff>> = new Observable<Page<Staff>>();
  currentPage: number = 0;
  pageSize: number = 10;
  username: string = '';
  searchTerm: string = '';
  // totalPages: number = 0;

  constructor(
    private _service: StaffCrudService,
    private _route: Router,
    private _notiService: NotificationService,
    private _searchService: SearchService
  ) { 
    effect(() => {
      this.searchTerm = this._searchService.searchTerm$();
      this.loadStaff(0, this.searchTerm);
    });
  }

  ngOnInit(): void {
    this.loadStaff(0, '');

    if (localStorage.getItem('app-user')) {
      const user = JSON.parse(localStorage.getItem('app-user')!);
      this.username = user.name;
    }
  }

  loadStaff(page: number = 0, term: string) {
    this.currentPage = page;
    this.staffList$ = this._service.getPage(this.currentPage, this.pageSize, term)
      .pipe(
        catchError(err => {
          this._notiService.show(err.error.text, 'danger');
          throw err;
        })
      );
  }

  nextPage(totalPages: number) {
    if (this.currentPage < totalPages - 1) {
      this.loadStaff(this.currentPage + 1, this.searchTerm);
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.loadStaff(this.currentPage - 1, this.searchTerm);
    }
  }

  openEdit(data: Staff): void {
    this.selectedStaff = data;
    console.log(this.selectedStaff);
    this._route.navigate(['/staff/edit', data.staffId])
    this.editStaff.openModal();
  }

  openDelete(data: Staff): void {
    this._route.navigate(['/staff/delete', data.staffId]);
    this.deleteStaff.openModal();
  }
  
  openAccount(data: Staff): void {
    console.log(data);
    this._service.checkHasAccount(data.staffId).subscribe({
      next: res => {
        console.log(res);
      },
      error: res => {
        console.log(res);
      },
      complete: () => {
        console.log('complete');
      }
    })
    if(this._service.checkHasAccount(data.staffId)){
      console.log('has account');
    }else{
      console.log('doesnt have account');
    }
    // this._route.navigate(['/staff/account', data.staffId]);
    // this.editStaff.openModal();
  }
}
