import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NotificationService } from '../../notification/notification-service';
import { DepartmentCrudService } from '../data/department-crud-service';

@Component({
  selector: 'app-delete-department',
  imports: [
    RouterModule,
  ],
  templateUrl: './delete-department.html',
  styleUrl: './delete-department.css'
})
export class DeleteDepartment {
  showLoading: boolean = false;
  departmentId!: string;
  @ViewChild('deleteModalTrigger') modalTrigger!: ElementRef;
  // @ViewChild('deleteModal') deleteModal!: ElementRef;

  constructor(
    private activatedRoute: ActivatedRoute, 
    private notiService: NotificationService, 
    private departmentService: DepartmentCrudService
  ){}

  ngOnInit(): void {}
  
  openModal(): void {
    this.modalTrigger.nativeElement.click();
  }
  
  // closeModal(): void {
  //   this.deleteModal.nativeElement.modal('hide');
  // }

  deleteDepartment(){
    let param = this.activatedRoute.firstChild?.snapshot.paramMap.get('departmentId');
    if(param){
      this.departmentId = param;
    }
    this.departmentService.delete(this.departmentId).subscribe({
       next: response => {
           this.showLoading = false;
           console.log(response);
           this.notiService.show(response.statusMessage,'success');
          //  this.dialogRef.close({message: 'success'});
       },
       error: response => {
           this.showLoading = false;
           console.log(response);
           this.notiService.show(response.error.statusMessage,'danger');
       },
       complete: () => { 
        this.showLoading = false ;
        // this.dialogRef.close();
      }
    });
  }
}
