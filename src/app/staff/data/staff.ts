import { Department } from "../../department/data/department";

export interface Staff {
    accountId: number;
    staffId: number;
    department: Department;
    name: string;
    email: string;
    socialSecurityNumber: string;
    phoneNumber: string;
    gender: string;
    dateOfBirth: Date;
    joinDate: Date;
    staffStatus: string;
}
