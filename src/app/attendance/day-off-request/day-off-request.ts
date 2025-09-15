import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Staff } from '../../staff/data/staff';
import { AuthenticationService } from '../../login/authentication-service';
import { NotificationService } from '../../notification/notification-service';
import { DayOffRequestService } from './data/day-off-request-service';
import { take } from 'rxjs';

@Component({
  selector: 'app-day-off-request',
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './day-off-request.html',
  styleUrl: './day-off-request.css'
})
export class DayOffRequest {
  addDayOffRequestForm!: FormGroup;
  showLoading: boolean = false;
  hide: boolean = true;
  isDragging = signal(false);
  fileName = signal<string | null>(null);
  currentUser: Staff | null = null;
  toAddFile?: File|null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private notiService: NotificationService,
    private dayOffService: DayOffRequestService
  ) {
    this.addDayOffRequestForm = this.formBuilder.group({
      staffId: new FormControl({value: '', disabled: true}),
      name: new FormControl({value:'', disabled: true}),
      department: new FormControl({value: '', disabled: true}),
      fromDate: new FormControl('', [Validators.required]),
      toDate: new FormControl('', [Validators.required]),
      dayOffReason: new FormControl('')
    });
    this.currentUser = this.authService.getCurrentUser();
    if(this.currentUser){
      this.addDayOffRequestForm.get('staffId')!.setValue(this.currentUser.staffId);
      this.addDayOffRequestForm.get('name')!.setValue(this.currentUser.name);
      this.addDayOffRequestForm.get('department')!.setValue(this.currentUser.department.departmentName);
    }
   }

  /**
   * Handles the file selection when the user clicks and uses the file browser.
   */
  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    const files = element.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  /**
   * Prevents the browser's default drag behavior.
   */
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  /**
   * Resets the dragging state when the dragged file leaves the drop zone.
   */
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  /**
   * Handles the file when it is dropped onto the zone.
   */
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  /**
   * Processes the selected file.
   */
  private handleFile(file: File): void {
    this.fileName.set(file.name);
    // Here, you would typically upload the file to your server.
    console.log('Selected file:', file);
    this.toAddFile = file;
  }

  /**
   * Clears the selected file.
   */
  clearFile(event: MouseEvent): void {
    event.stopPropagation(); // Prevents the click from re-opening the file browser
    this.fileName.set(null);
  }

  add(): void {
    this.showLoading = true;
    const fd = new FormData();
    fd.append('dayOffRequest', this.createRequestBlob());
    if(this.toAddFile){
      fd.append('document', this.toAddFile);
    }
    this.dayOffService.create(fd).pipe(take(1)).subscribe({
      next: res => {
        this.showLoading = false;
        this.notiService.show('Day off request added successfully', 'success');
        this.resetForm();
      },
      error: res => {
        this.showLoading = false;
        this.notiService.show(res.error.statusMessage, 'danger');
        // this.resetForm();
      },
      complete: () => this.showLoading = false
    });

    this.showLoading = false;
  }

  createRequestBlob(): Blob{
    const data = this.addDayOffRequestForm.getRawValue();
    const request = {
      staffId: data.staffId,
      fromDate: data.fromDate,
      toDate: data.toDate,
      reason: data.dayOffReason,
    }
    console.log(request);
    const jsonObject = JSON.stringify(request);
    const blob = new Blob([jsonObject], {
      type: 'application/json'
    });
    return blob;
  }

  resetForm(): void{
    this.addDayOffRequestForm.reset();
    this.addDayOffRequestForm.markAsPristine();
  }
}
