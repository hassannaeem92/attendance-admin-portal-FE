import { Component, inject } from '@angular/core';
import { LocationService } from '../../../_services/location/location.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Utils } from '../../../../utils';
import { MatButtonModule } from '@angular/material/button';
import { NgClass } from '@angular/common';
import { ColumnMode, NgxDatatableModule, SelectionType } from '@swimlane/ngx-datatable';
import { TableFooterComponent } from '../../../../_sharedresources/table-footer/table-footer.component';
import { Page } from '../../../../_sharedresources/page';

@Component({
  selector: 'app-all-company-location',
  standalone: true,
  imports: [
    MatButtonModule,
    RouterLink,
    NgClass,
    NgxDatatableModule,
    TableFooterComponent,
  ],
  templateUrl: './all-company-location.component.html',
  styleUrl: './all-company-location.component.scss'
})
export class AllCompanyLocationComponent {
  readonly utils = inject(Utils);
    readonly locationService = inject(LocationService);
    readonly router = inject(Router);
    readonly route = inject(ActivatedRoute);
  
  
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
  
    rows: any = [];
    // // Handle the Create button click
    onCreate() {
      console.log('Create button clicked');
    }
  
    isOrganizationLocation: boolean = false;
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
      // this.page, this.searchKeyword
  
      // const body = {
      //   "PageIndex": 1,
      //   "PageSize": 10,
  
      // };
  
  
  
      this.subscription = this.locationService.getAllLocations(this.page, pIndex, this.orgIdFromLocalHost, this.isOrganizationLocation,this.isActive).subscribe((pagedData) => {
        if (pagedData) {
          this.page.totalElements = pagedData.TotalPages;
          // this.page.totalElements = this.page.totalElements;
          var filteredRows = pagedData.Result;
  
          this.rows = filteredRows;
  
        }
  
        this.utils.hideLoader();
      }, (error => {
        this.utils.hideLoader();

      }));
    }
  
    setPageAdmin(pageInfo: any, flag?: any) {
      // this.selected = [];
      this.utils.showLoader();
      
  
      this.selected = [];
      var pIndex = pageInfo.offset + 1;
      this.page.pageNumber = pageInfo.offset
      this.page.pageIndex = pageInfo.offset
      this.page.searchKeyword = this.searchKeyword;
  
      this.page.searchTerm = '';
      // this.page, this.searchKeyword
  
      // const body = {
      //   "PageIndex": 1,
      //   "PageSize": 10,
  
      // };
  
  
  
      this.subscription = this.locationService.getAllLocationsForAdmin(this.page, pIndex, this.orgIdFromLocalHost).subscribe((pagedData) => {
        if (pagedData) {
          this.page.totalElements = pagedData.TotalPages;
          // this.page.totalElements = this.page.totalElements;
          var filteredRows = pagedData.Result.filter(row => row.IsActive);
  
          this.rows = filteredRows;
  
        }
  
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
    currentUserId: any;
    currentUserRole: any
    orgIdFromLocalHost: any
  
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
  
  
      // this.utils.showLoader()
  
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
          this.router.navigate(['/main/attendance/client-company-location/edit', event.row.Id]);
        }
      }
    }
    onSelect({ selected }: any) {
      this.selected.splice(0, this.selected.length);
      this.selected.push(...selected);
    }
  
   
    changePageSize(event: any) {
      this.page.pageSize = event;
      this.setPage({ offset: 0 });
    }
  
    toDelete() {
      const body = {
        id: this.selected[0].Id,
      };
  
  
      this.locationService.deleteLocation(body).subscribe(data => {
  
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
  
    onSearch(event: any){
      this.searchKeyword = event.target.value;
      this.setPage({ offset: 0 });
    }

    //filters
    setStatus(status?: boolean){
      this.isActive = status;
      this.setPage({ offset: 0 });
    }
  
    // toggleStatus(row: any): void {
    //   this.utils.showLoader();
    //   if(row.IsActive == false)
    //   {
    //     row.IsActive = true;
    //     this.locationService.addLocation(row).subscribe(res => {
    //       if (res && res.StatusCode == 200) {
    //         this.utils.notification('ata has been updated successfully.', 'success');
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
  
    //     this.locationService.deleteLocation(body).subscribe(data => {
    
    //       this.setPage({ offset: 0 });
    //       // $('#confirmation-modal').modal('hide');
    //       if (data.StatusCode == 200) {
    //         // Utils.notification(data.btiMessage.message, 'success');
    //         this.utils.notification('Data has been updated successfully.', 'success');
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
            this.locationService.deleteLocation(body).subscribe(data => {
              if (data.StatusCode === 200) {
                this.utils.notification('Data has been updated successfully.', 'success');
              } else {
                this.utils.notification(data.CommonMessage || 'Failed to deactivate data', 'error');
                this.setPage({ offset: 0 });
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
        this.locationService.addLocation(row).subscribe(res => {
          if (res && res.StatusCode === 200) {
            this.utils.notification('Data has been updated successfully.', 'success');
            this.setPage({ offset: 0 });
          } else {
            this.utils.notification('Failed to update data.', 'error');
          }
          this.utils.hideLoader();
        });
      }
    }
    
  
}
