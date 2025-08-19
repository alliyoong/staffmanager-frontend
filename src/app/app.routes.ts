import { Routes } from '@angular/router';
import { ListStaff } from './staff/list-staff/list-staff';
import { EditStaff } from './staff/edit-staff/edit-staff';
import { DeleteStaff } from './staff/delete-staff/delete-staff';
import { ViewStaffDetail } from './staff/view-staff-detail/view-staff-detail';
import { AddStaff } from './staff/add-staff/add-staff';
import { ListDepartment } from './department/list-department/list-department';
import { EditDepartment } from './department/edit-department/edit-department';
import { DeleteDepartment } from './department/delete-department/delete-department';
import { ViewDepartmentDetail } from './department/view-department-detail/view-department-detail';
import { AddDepartment } from './department/add-department/add-department';

export const routes: Routes = [
//   { path: 'register', component: RegisterComponent },
//   { path: 'login', component: LoginComponent },
  {
    path: 'staff', component: ListStaff, children: [
      { path: 'edit/:staffId', component: EditStaff },
      { path: 'delete/:staffId', component: DeleteStaff },
      { path: 'view/:staffId', component: ViewStaffDetail }
    ]
  },
  { path: 'staff/add', component: AddStaff },
  {
    path: 'department', component: ListDepartment, children: [
      { path: 'edit/:departmentId', component: EditDepartment },
      { path: 'delete/:departmentId', component: DeleteDepartment },
      { path: 'view/:departmentId', component: ViewDepartmentDetail }
    ]
  },
  { path: 'department/add', component: AddDepartment },
// //   { path: 'verify/account/:key', component: VerifyAccountComponent },
//   { path: '', redirectTo: '/accounts', pathMatch: 'full' },
//   { path: '**', component: PageNotFoundComponent },
];
