import { Component, inject } from '@angular/core';
import { QRCodeComponent } from 'angularx-qrcode';
import { TableFooterComponent } from '../../../../_sharedresources/table-footer/table-footer.component';
import { ColumnMode, NgxDatatableModule, SelectionType } from '@swimlane/ngx-datatable';
import { NgClass } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Utils } from '../../../../utils';
import { DevicesService } from '../../../_services/devices/devices.service';
import { Page } from '../../../../_sharedresources/page';
import { HolidayService } from '../../../_services/holiday/holiday.service';

@Component({
  selector: 'app-all-holiday',
  standalone: true,
  imports: [
    MatButtonModule,
    RouterLink,
    NgClass,
    NgxDatatableModule,
    TableFooterComponent,
    
  ],
  templateUrl: './all-holiday.component.html',
  styleUrl: './all-holiday.component.scss'
})
export class AllHolidayComponent {
readonly utils = inject(Utils);
  // readonly locationService = inject(LocationService);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly holidayService = inject(HolidayService);


  rowData: any[] = [];
  gridApi: any;
  gridColumnApi: any;

  page = new Page();
  searchKeyword: any = '';
  // rows: any = [];
  subscription: any;
  selected: any = [];
 messages = {
    totalMessage: 'Records', // Custom label for total count
  };

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  isActive? : boolean;
  isOrganization? : boolean;

  rows: any = [];
  // // Handle the Create button click
  onCreate() {
    console.log('Create button clicked');
  }

  setPage(pageInfo: any, flag?: any) {
    // this.selected = [];
    this.utils.showLoader();
    this.rows = JSON.parse(JSON.stringify([]));
    this.selected = [];
    var pIndex = pageInfo.offset + 1;
    this.page.pageNumber = pageInfo.offset
    this.page.pageIndex = pageInfo.offset
    this.page.searchKeyword = this.searchKeyword;


    this.page.searchTerm = '';


    this.subscription = this.holidayService.getAllHolidays(this.page, pIndex, this.orgIdFromLocalHost,this.isActive,this.isOrganization).subscribe((pagedData) => {
      if (pagedData) {
        this.page.totalElements = pagedData.TotalPages;
        var filteredRows = pagedData.Result;

        this.rows = filteredRows
      }
      this.utils.hideLoader();


    }, (error) => {
      this.utils.hideLoader();
    });
  }

  // Column Definitions
  columnDefs: any = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      field: 'id',
      headerName: 'ID',
      sortable: true,
      filter: true,
    },
    { field: 'name', headerName: 'Name', sortable: true, filter: true },
    {
      field: 'age',
      headerName: 'Age',
      sortable: true,
      filter: true,
      cellClassRules: {
        'green-cell': (params: { value: number }) => params.value > 20,
      },
    },
    { field: 'city', headerName: 'City', sortable: true, filter: true },
    { field: 'email', headerName: 'Email', sortable: true, filter: true },
  ];

  defaultColDef = {
    resizable: true,
    sortable: true,
    filter: true,
    floatingFilter: true,
  };

  paginationPageSize = 10;
  currentUserId: any
  orgIdFromLocalHost: any
  currentUserRole: any

  ngOnInit(): void {

    const userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null;
    this.currentUserId = userData.Id
    this.currentUserRole = userData.Role;
    this.orgIdFromLocalHost = userData.OrganizationId

    if(this.currentUserRole == 'Admin' && this.orgIdFromLocalHost){
      this.setPage({ offset: 0 }, true);
    }else {
      this.setPage({ offset: 0 }, true);
    }


    // this.setPage({ offset: 0 }, true);

  }

  // Grid Ready Event


  // Handle row selection
  onSelectionChanged(event: any) {
    console.log('Selection Changed:', event);
  }

  ///New Code

  edit(event: any) {
    // if (event && event.cellIndex !== 0) {
    //   if (event.type === 'click' && event.row) {
    //   }
    // }
    if (event && event.cellIndex !== 0) {
      if (event.type === 'click' && event.type != 'checked') {
        this.router.navigate(['/main/attendance/holiday/edit', event.row.Id]);
      }
    }
  }
  onSelect({ selected }: any) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  changePageSize(event: any) {
    this.page.size = event;
    this.setPage({ offset: 0 });
  }

  toDelete() {

    const body = {
      id: this.selected[0].Id,
    };


    this.holidayService.deleteHolidays(body).subscribe(data => {

      this.setPage({ offset: 0 });
      // $('#confirmation-modal').modal('hide');
      if (data.StatusCode == 200) {
        // Utils.notification(data.btiMessage.message, 'success');
        this.utils.notification('Delete SuccessFully', 'success');
      } else {
        // Utils.notification(data.btiMessage.message, 'error');
        this.utils.notification('Falled', 'error');

      }
    })

  }
  qrData: string = '';
  openModalQR(row: any, event: any) {
    
    event.stopPropagation();

    var scanableObject = {
      id: row.Id,
      companyAddress: row.Company?.Address ?? null,
      companyCity: row.Company?.City ?? null,
      companyCountry: row.Company?.Country ?? null,
      companyRegNo: row.Company?.CompanyRegNo ?? null,
      companyName: row.Company?.Name ?? null,
      companyId: row.Company?.Id ?? null,
      companyEmail: row.Company?.Email ?? null,
      companyIsActive: row.Company?.IsActive ?? null,

      organizationAddress: row.Organization?.Address ?? null,
      organizationCity: row.Organization?.City ?? null,
      organizationCountry: row.Organization?.Country ?? null,
      organizationRegNo: row.Organization?.CompanyRegNo ?? null,
      organizationName: row.Organization?.Name ?? null,
      organizationId: row.Organization?.Id ?? null,
      organizationState: row.Organization?.State ?? null,
      organizationEmail: row.Organization?.Email ?? null,
      organizationIsActive: row.Organization?.IsActive ?? null,

      userId: row?.UserId ?? null,
      attendanceType: 'finger',

      locationId: row.Location?.Id ?? null,



    }

    // this.qrData = JSON.stringify(scanableObject); // Prepare data for QR code
    // const modalElement = document.getElementById('qrModal') as HTMLElement;
    // const bootstrapModal = new bootstrap.Modal(modalElement);
    // bootstrapModal.show();
  }

  downloadQRCode(qrCodeCanvas: any): void {
    // Get the canvas element
    const canvas = qrCodeCanvas.qrcElement.nativeElement.querySelector('canvas');

    if (canvas) {
      // Convert the canvas to a data URL
      const dataUrl = canvas.toDataURL('image/png');

      // Create a temporary anchor element to trigger the download
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'qr-code.png';
      link.click();
    } else {
      console.error('QR Code canvas not found!');
    }
  }

  onSearch(event: any) {
    this.searchKeyword = event.target.value;
    this.setPage({ offset: 0 });
  }

  //Filter
  setStatus(status?: boolean){
    this.isActive = status;
    this.setPage({ offset: 0 });
  }

  getIsCompanies(isCompany?: boolean){
    this.isOrganization = isCompany;
    this.setPage({ offset: 0 });
  }

  // toggleStatus(row: any): void {
  //   this.utils.showLoader();
  //   if(row.IsActive == false)
  //   {
  //     row.IsActive = true;
  //     this.holidayService.addEditHolidays(row).subscribe(res => {
  //       if (res && res.StatusCode == 200) {
  //         this.utils.notification('Holiday Active Successfully.', 'success');
  //         this.setPage({ offset: 0 });
  //         this.utils.hideLoader();
  //       }
  //     })
  //   }
  //   else
  //   {
  //     const body = {
  //       id: row.Id,
  //     };

  //     this.holidayService.deleteHolidays(body).subscribe(data => {
  
  //       this.setPage({ offset: 0 });
  //       // $('#confirmation-modal').modal('hide');
  //       if (data.StatusCode == 200) {
  //         // Utils.notification(data.btiMessage.message, 'success');
  //         this.utils.notification('Holiday InAcitve Successfully.', 'success');
  //         this.setPage({ offset: 0 });
          
  //       } else {
  //         // Utils.notification(data.btiMessage.message, 'error');
  //         this.utils.notification('Falled', 'error');
  
  //       }
  //     })
  //   }
    
  //   this.utils.hideLoader();
  // }

  toggleStatus(row: any): void {
    if (row.IsActive) {
      // Show confirmation dialog before deactivating
      this.utils.confirmDelete().then((result: boolean) => {
        if (result) {
          this.utils.showLoader();
          const body = { id: row.Id };
          this.holidayService.deleteHolidays(body).subscribe(data => {
            if (data.StatusCode === 200) {
              this.utils.notification('Holiday Inactive Successfully.', 'success');
            } else {
              this.utils.notification(data.CommonMessage || 'Failed to update holiday status.', 'error');
            }
            this.setPage({ offset: 0 });
            this.utils.hideLoader();
          });
        } else {
          // User canceled, revert toggle
          setTimeout(() => {
            row.IsActive = true;
            this.setPage({ offset: 0 });
          }, 0);
        }
      });
    } else {
      // Directly activate without confirmation
      this.utils.showLoader();
      row.IsActive = true;
      this.holidayService.addEditHolidays(row).subscribe(res => {
        if (res && res.StatusCode === 200) {
          this.utils.notification('Holiday Activated Successfully.', 'success');
        } else {
          this.utils.notification('Failed to activate holiday.', 'error');
        }
        this.setPage({ offset: 0 });
        this.utils.hideLoader();
      });
    }
  }
  

  getLocationAddress(row: any): string {
    return row.CompanyLocation?.Name || row.OrganizationLocation?.Name || '';
  }
}
