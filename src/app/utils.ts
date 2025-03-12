// utils.service.ts
import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ThemeService } from './_sharedresources/_services/theme.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',  // This makes it available app-wide
})
export class Utils {
  readonly themeService = inject(ThemeService);
  readonly spinner = inject(NgxSpinnerService);

  themeStatus: any

  constructor(private toastr: ToastrService) {


    this.themeService.theme$.subscribe(theme => {
      this.themeStatus = theme;
    });
    
  }

  // Method to show notification
  public notification(message: string, type: 'success' | 'error' | 'info' | 'warning'): void {
    
    switch (type) {
      case 'success':
        this.toastr.success(message);
        break;
      case 'error':
        this.toastr.error(message);
        break;
      case 'info':
        this.toastr.info(message);
        break;
      case 'warning':
        this.toastr.warning(message);
        break;
      default:
        break;
    }
  }


  public showLoader(): void {
    this.spinner.show();
  }

  public hideLoader(): void {
    this.spinner.hide();
  }


  onlyDecimalNumberKey(event) {
    let e = event;
    if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A
      (e.keyCode == 65 && e.ctrlKey === true) ||
      // Allow: Ctrl+C
      (e.keyCode == 67 && e.ctrlKey === true) ||
      // Allow: Ctrl+X
      (e.keyCode == 88 && e.ctrlKey === true) ||
      // Allow: Ctrl+V
      (e.keyCode == 86 && e.ctrlKey === true) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)) {
      // let it happen, don't do anything
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  }


  confirmDelete(): Promise<boolean> {
    return Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Delete!',
      cancelButtonText: 'No',
    }).then((result) => result.isConfirmed); // Returns true if "Yes", false if "No"
  }
  

}
