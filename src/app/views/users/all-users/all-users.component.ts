import { NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Utils } from '../../../utils';
import { ColumnMode, NgxDatatableModule, SelectionType } from '@swimlane/ngx-datatable';
import { TableFooterComponent } from '../../../_sharedresources/table-footer/table-footer.component';
import { UserServiceService } from '../../_services/user-service.service';
import { Page } from '../../../_sharedresources/page';
import { UserLocationModalComponent } from "../../../_sharedresources/modals/user-location-modal/user-location-modal.component";
import { MatIconModule } from '@angular/material/icon';
declare const $: any;

@Component({
  selector: 'app-all-users',
  standalone: true,
  imports: [
    MatButtonModule,
    RouterLink,
    NgClass,
    NgxDatatableModule,
    TableFooterComponent,
    UserLocationModalComponent,
    MatIconModule
],
  templateUrl: './all-users.component.html',
  styleUrl: './all-users.component.scss'
})
export class AllUsersComponent {
  readonly utils = inject(Utils);
  readonly userService = inject(UserServiceService);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  http = inject(HttpClient);

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

  setPage(pageInfo: any) {
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



    this.subscription = this.userService.getAllUsers(this.page, pIndex, this.orgIdFromLocalHost,this.isActive,this.isOrganization).subscribe((pagedData) => {
      
      if (pagedData && pagedData.Result && pagedData.Result.length) {
        this.page.totalElements = pagedData.TotalPages;
        // this.page.totalElements = this.page.totalElements;
        // var filteredRows = pagedData.Result.filter(row => row.IsActive);
        this.rows = pagedData.Result

        
        this.utils.hideLoader();

      }else {
        this.utils.hideLoader();
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
  orgIdFromLocalHost: any;
  currentUserRole: any;
  currentUserId: any;

  ngOnInit(): void {
    this.utils.showLoader();

    const userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null;
    this.currentUserId = userData.Id
    this.currentUserRole = userData.Role;
    this.orgIdFromLocalHost = userData.OrganizationId

    if(this.currentUserRole == 'Admin' && this.orgIdFromLocalHost){
      this.setPage({ offset: 0 });
    }else {
      this.setPage({ offset: 0 });
    }


    // this.setPage({ offset: 0 });
  }

  // Grid Ready Event
  onGridReady(params: any) {
    
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    // Define the Server-Side Data Source
    const dataSource = {
      getRows: (params: any) => {
        const page = params.startRow / this.paginationPageSize + 1;
        const pageSize = this.paginationPageSize;

        // Make the API Call
        this.http
          .get('https://jsonplaceholder.typicode.com/users?_page=1&_limit=10', {
            params: {
              page: page.toString(),
              pageSize: pageSize.toString(),
            },
          })
          .subscribe((data: any) => {
            // Update grid with received data
            params.successCallback(data.items, data.totalCount);
          });
      },
    };

    // Set the data source
    this.gridApi.setDatasource(dataSource);
  }

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
        this.router.navigate(['main/user/edit', event.row.Id]);
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


    this.userService.deleteUserById(body).subscribe(data => {

      this.setPage({ offset: 0 });
      // $('#confirmation-modal').modal('hide');
      if (data.StatusCode == 200) {
        // Utils.notification(data.btiMessage.message, 'success');
        this.utils.notification('Delete SuccessFully', 'success');
        this.setPage({ offset: 0 });
      } else {
        // Utils.notification(data.btiMessage.message, 'error');
        this.utils.notification('Falled', 'error');

      }
    })

  }
  onSearch(event: any) {
    this.searchKeyword = event.target.value;
    this.setPage({ offset: 0 });
  }

  setStatus(status?: boolean){
    this.isActive = status;
    this.setPage({ offset: 0 });
  }

  getIsCompanies(isCompany?: boolean){
    this.isOrganization = isCompany;
    this.setPage({ offset: 0 });
  }

  // toggleStatus(row: any): void {
  //   if (row.IsActive) {
  //     // Show confirmation dialog before deactivating
  //     this.utils.confirmDelete().then((result: boolean) => {
  //       if (result) {
  //         this.utils.showLoader();
  //         const body = { id: row.Id };
  //         this.userService.deleteUserById(body).subscribe(data => {
  //           if (data.StatusCode === 200) {
  //             this.utils.notification('User Inactive Successfully.', 'success');
  //           } else {
  //             this.utils.notification(data.CommonMessage || 'Failed to update user status.', 'error');
  //           }
  //           this.setPage({ offset: 0 });
  //           this.utils.hideLoader();
  //         });
  //       } else {
  //         // User canceled, revert toggle
  //         setTimeout(() => {
  //           row.IsActive = true;
  //           this.setPage({ offset: 0 });
  //         }, 0);
  //       }
  //     });
  //   } else {
  //     // Directly activate without confirmation
  //     this.utils.showLoader();
  //     row.IsActive = true;
  //     this.userService.addEditUser(row).subscribe(res => {
  //       if (res && res.StatusCode === 200) {
  //         this.utils.notification('User Activated Successfully.', 'success');
  //       } else {
  //         this.utils.notification('Failed to activate user.', 'error');
  //       }
  //       this.setPage({ offset: 0 });
  //       this.utils.hideLoader();
  //     });
  //   }
  // }
  
  toggleStatus(row: any): void {
    if (row.IsActive) {
        // Show confirmation dialog before deactivating
        this.utils.confirmDelete().then((result: boolean) => {
            if (result) {
                this.utils.showLoader();
                this.userService.deActiveUserById(row.Id).subscribe(data => {
                    if (data.StatusCode === 200) {
                        this.utils.notification('User Deactivated Successfully.', 'success');
                    } else {
                        this.utils.notification(data.CommonMessage || 'Failed to update user status.', 'error');
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
        this.userService.activeUserById(row.Id).subscribe(res => {
            if (res && res.StatusCode === 200) {
                this.utils.notification('User Activated Successfully.', 'success');
            } else {
                this.utils.notification('Failed to activate user.', 'error');
            }
            this.setPage({ offset: 0 });
            this.utils.hideLoader();
        });
    }
}


  
  updateStatusInBackend(row: any): void {
    // Example API call to update the status
    // this.apiService.updateStatus(row.id, row.IsActive).subscribe(
    //   () => console.log('Status updated successfully'),
    //   (error) => console.error('Error updating status:', error)
    // );
  }


  getLocationAddress(row: any): string {
    return row.CompanyLocation?.Name || row.OrganizationLocation?.Name || '';
  }


  locationsArrayData: any = [];
  openUserLocationModal(row, event){
    event.stopPropagation();
    
    if((row.CompanyLocation?.length > 0 || row.OrganizationLocation?.length > 0)){
      this.locationsArrayData = {};
      this.locationsArrayData = JSON.parse(JSON.stringify(row));

      $('#usersLocation-modal').modal('show');
    }else {
      this.utils.notification('No Location Assign', 'error');
    }
  

  }
  
  
}
