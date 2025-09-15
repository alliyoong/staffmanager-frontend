import { Routes } from '@angular/router';
import { ListStaff } from './staff/list-staff/list-staff';
import { EditStaff } from './staff/edit-staff/edit-staff';
import { DeleteStaff } from './staff/delete-staff/delete-staff';
import { DetailStaff } from './staff/detail-staff/detail-staff';
import { AddStaff } from './staff/add-staff/add-staff';
import { ListDepartment } from './department/list-department/list-department';
import { EditDepartment } from './department/edit-department/edit-department';
import { DeleteDepartment } from './department/delete-department/delete-department';
import { ViewDepartmentDetail } from './department/view-department-detail/view-department-detail';
import { AddDepartment } from './department/add-department/add-department';
import { Login } from './login/login';
import { CheckInOut } from './attendance/check-in-out/check-in-out';
import { Logout } from './logout/logout';
import { Home } from './home/home';
import { authenticationGuard } from './guard/authentication-guard';
import { DayOffRequest } from './attendance/day-off-request/day-off-request';

export const routes: Routes = [
//   { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'login', component: Login },
  { path: 'logout', component: Logout },
  { path: 'attendance', component: CheckInOut, canActivate: [authenticationGuard] },
  { path: 'day-off-request', component: DayOffRequest, canActivate: [authenticationGuard] },
  {
    path: 'staff', component: ListStaff, children: [
      { path: 'edit/:staffId', component: EditStaff },
      { path: 'delete/:staffId', component: DeleteStaff },
      { path: 'detail/:staffId', component: DetailStaff }
    ], canActivate: [authenticationGuard]
  },
  { path: 'staff/add', component: AddStaff, canActivate: [authenticationGuard] },
  {
    path: 'department', component: ListDepartment, children: [
      { path: 'edit/:departmentId', component: EditDepartment },
      { path: 'delete/:departmentId', component: DeleteDepartment },
      { path: 'view/:departmentId', component: ViewDepartmentDetail }
    ], canActivate: [authenticationGuard]
  },
  { path: 'department/add', component: AddDepartment, canActivate: [authenticationGuard] },
// //   { path: 'verify/account/:key', component: VerifyAccountComponent },
//   { path: '**', component: PageNotFoundComponent },
];
