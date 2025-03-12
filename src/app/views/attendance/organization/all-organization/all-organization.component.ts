import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { Utils } from '../../../../utils';
import { ColumnMode, NgxDatatableModule, SelectionType } from '@swimlane/ngx-datatable';
import { TableFooterComponent } from '../../../../_sharedresources/table-footer/table-footer.component';
import { UserServiceService } from '../../../_services/user-service.service';
import { Page } from '../../../../_sharedresources/page';
import { OrganizationService } from '../../../_services/organization/organization.service';


@Component({
  selector: 'app-all-organization',
  standalone: true,
  imports: [
    MatButtonModule,
    RouterLink,
    NgClass,
    NgxDatatableModule,
    TableFooterComponent,
  ],
  templateUrl: './all-organization.component.html',
  styleUrl: './all-organization.component.scss'
})
export class AllOrganizationComponent {
  readonly utils = inject(Utils);
  readonly userService = inject(UserServiceService);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly organizationService = inject(OrganizationService);

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
  isActive: boolean;

  rows: any = [];
  // // Handle the Create button click
  onCreate() {
    console.log('Create button clicked');
  }

  setPage(pageInfo: any, flag?: any) {
    // this.selected = [];
    this.selected = [];
    this.rows = JSON.parse(JSON.stringify([]));

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



    this.subscription = this.organizationService.getAllOrganizations(this.page, pIndex,this.isActive).subscribe((pagedData) => {
      if (pagedData) {
        // this.page.totalElements = this.page.totalElements;
        this.page.totalElements = pagedData.TotalPages;

        var filteredRows = pagedData.Result;
        this.rows = filteredRows;


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

  ngOnInit(): void {
    this.utils.showLoader()

    this.setPage({ offset: 0 }, true);
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
        this.router.navigate(['/main/attendance/organization/edit', event.row.Id]);
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
    
    // if (this.selected.length > 0) {
    // var selectedId = this.selected.map((x: any) => {
    //   return x.id;
    // });

    const body = {
      id: this.selected[0].Id,
    };


    this.organizationService.deleteOrganization(body).subscribe(data => {

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
  //     this.organizationService.addOrganization(row).subscribe(res => {
  //       if (res && res.StatusCode == 200) {
  //         this.utils.notification('Company Active Successfully.', 'success');
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

  //     this.organizationService.deleteOrganization(body).subscribe(data => {
  
  //       this.setPage({ offset: 0 });
  //       // $('#confirmation-modal').modal('hide');
  //       if (data.StatusCode == 200) {
  //         // Utils.notification(data.btiMessage.message, 'success');
  //         this.utils.notification('Company InAcitve Successfully.', 'success');
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
      // Show confirmation dialog only when turning OFF (deactivating)
      this.utils.confirmDelete().then((result: boolean) => {
        if (result) {
          this.utils.showLoader();
          const body = { id: row.Id };
          this.organizationService.deleteOrganization(body).subscribe(data => {
            if (data.StatusCode === 200) {
              this.utils.notification('Company Inactive Successfully.', 'success');
            } else {
              this.utils.notification(data.CommonMessage || 'Failed to deactivate company.', 'error');
              this.setPage({ offset: 0 });
            }
            this.setPage({ offset: 0 });
            this.utils.hideLoader();
          });
        } else {
          // User clicked "No" -> Revert toggle
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
      this.organizationService.addOrganization(row).subscribe(res => {
        if (res && res.StatusCode === 200) {
          this.utils.notification('Company Activated Successfully.', 'success');
          this.setPage({ offset: 0 });
        } else {
          this.utils.notification('Failed to activate company.', 'error');
        }
        this.utils.hideLoader();
      });
    }
  }
  

}
