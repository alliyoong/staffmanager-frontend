import { Account } from "../../account/data/account";
import { Department } from "../../department/data/department";

export interface Staff {
    staffId: number;
    department: Department;
    account: Account;
    name: string;
    email: string;
    socialSecurityNumber: string;
    phoneNumber: string;
    gender: string;
    dateOfBirth: Date;
    joinDate: Date;
    staffStatus: string;
}
