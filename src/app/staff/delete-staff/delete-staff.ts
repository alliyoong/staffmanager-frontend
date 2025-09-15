import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NotificationService } from '../../notification/notification-service';
import { StaffCrudService } from '../data/staff-crud-service';

@Component({
  selector: 'app-delete-staff',
  imports: [
    RouterModule
  ],
  templateUrl: './delete-staff.html',
  styleUrl: './delete-staff.css'
})
export class DeleteStaff {
  showLoading: boolean = false;
  staffId!: string;
  @ViewChild('deleteModalTrigger') modalTrigger!: ElementRef;
  @ViewChild('deleteModalClose') modalClose!: ElementRef;
  // @ViewChild('deleteModal') deleteModal!: ElementRef;

  constructor(
    private activatedRoute: ActivatedRoute, 
    private notiService: NotificationService, 
    private staffService: StaffCrudService
  ){}

  ngOnInit(): void {}
  
  openModal(): void {
    this.modalTrigger.nativeElement.click();
  }
  
  // closeModal(): void {
  //   this.deleteModal.nativeElement.modal('hide');
  // }

  deleteStaff(){
    let param = this.activatedRoute.firstChild?.snapshot.paramMap.get('staffId');
    if(param){
      this.staffId = param;
    }
    this.staffService.delete(this.staffId).subscribe({
       next: response => {
           this.showLoading = false;
           console.log(response);
           this.notiService.show('Successfully deleted', 'success');
           this.modalClose.nativeElement.click();
           this.modalTrigger.nativeElement.focus();
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
