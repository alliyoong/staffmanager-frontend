import { Account } from "../../account/data/account";
import { Department } from "../../department/data/department";
import { JobPosition } from "../../job-position/job-position";

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
    jobPosition: JobPosition;
}
