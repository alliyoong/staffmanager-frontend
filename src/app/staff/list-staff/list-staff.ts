import { Component, effect, signal, Signal, ViewChild } from '@angular/core';
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
import { FormsModule, NgForm } from '@angular/forms';
import { Department } from '../../department/data/department';
import { AttendanceList } from '../../attendance/attendance-list/attendance-list';
import { Account } from '../../account/data/account';

@Component({
  selector: 'app-list-staff',
  imports: [
    CommonModule,
    FormsModule,
    DeleteStaff,
    EditStaff,
    AddAccount,
    EditAccount,
    AttendanceList
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
  // selectedAccount: Account | null = null;
  selectedAccount = signal<Account | null>(null);
  staffList$: Observable<Page<Staff>> = new Observable<Page<Staff>>();
  departmentOption$!: Observable<Department[]>;
  statusOption$!: Observable<string[]>;
  currentPage: number = 0;
  pageSize: number = 10;
  username: string = '';
  nameSearchTerm: string = '';
  searchCriteria = signal<any>({
    pageNumber: 0,
    pageSize: 10,
    name: '',
    email: '',
    ssn: '',
    department: 0,
    status: ''
  });
  
  // totalPages: number = 0;

  constructor(
    private _service: StaffCrudService,
    private _route: Router,
    private _notiService: NotificationService,
    // private _searchService: SearchService
  ) { 
    effect(() => {
      // this.nameSearchTerm = this._searchService.searchTerm$();
      this.loadStaff(this.searchCriteria);
    });
  }

  ngOnInit(): void {
    this.loadStaff(this.searchCriteria);
    this.departmentOption$ = this._service.getDepartmentOptions();
    this.statusOption$ = this._service.getStatusOptions();

    if (localStorage.getItem('app-user')) {
      const user = JSON.parse(localStorage.getItem('app-user')!);
      this.username = user.name;
    }
  }

  loadStaff(search: Signal<any>): void {
    let searchCriteria = search();
    searchCriteria = JSON.stringify(searchCriteria);
    this.staffList$ = this._service.getPage(searchCriteria)
      .pipe(
        // tap(data => console.log(data)),
        catchError(err => {
          this._notiService.show(err.error.text, 'danger');
          throw err;
        })
      );
  }

  nextPage(totalPages: number) {
    if (this.searchCriteria().pageNumber < totalPages - 1) {
      this.searchCriteria().pageNumber++;
      this.loadStaff(this.searchCriteria);
    }
  }

  prevPage() {
    if (this.searchCriteria().pageNumber > 0) {
      this.searchCriteria().pageNumber--;
      this.loadStaff(this.searchCriteria);
    }
  }

  openEdit(data: Staff): void {
    this.selectedStaff = data;
    this._route.navigate(['/staff/edit', data.staffId])
    this.editStaff.openModal();
  }

  openDelete(data: Staff): void {
    this._route.navigate(['/staff/delete', data.staffId]);
    this.deleteStaff.openModal();
  }
  
  openAccount(data: Staff): void {
    this.selectedStaff = data;
    this._service.checkHasAccount(data.staffId).subscribe({
      next: res => {
        if(res){
          // this._route.navigate([
          //   {outlets:{modal:['account', data.account.userId]}}
          // ]);
          this.selectedAccount.set({ ... res}) ;
          this.editAccount.openModal();
        } else {
          this.addAccount.openModal();
        }
      },
      error: res => {
        console.log(res);
      }    
    });
  }
  
  openAttendance(data: Staff): void {
    this.selectedStaff = data;
    console.log(this.selectedStaff);
    // this._route.navigate(['/attendance', data.staffId]);
  }
  
  applyFilter(values: any): void {
    const search = {
      pageNumber: 0,
      pageSize: 10,
      name: values.nameSearchTerm,
      email: values.emailSearchTerm,
      ssn: values.ssnSearchTerm,
      department: values.departmentSearchTerm,
      status: values.statusSearchTerm
    };
    this.searchCriteria.set(search);
  }
  
  clearFilter(form: NgForm): void {
    form.reset();
  }
}
