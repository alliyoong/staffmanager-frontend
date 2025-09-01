export interface Attendance {
    attendanceId: number;
    staffId: string;
    checkInTime: number;
    checkOutTime: number;
    attendanceStatus: 'REQUESTED' | 'APPROVED' | 'REJECTED';
    workDate: Date;
    totalHours: number;
}
