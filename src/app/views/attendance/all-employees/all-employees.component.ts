import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { Utils } from '../../../utils';
import { ColumnMode, NgxDatatableModule, SelectionType } from '@swimlane/ngx-datatable';
import { Page } from '../../../_sharedresources/page';
import { UserServiceService } from '../../_services/user-service.service';
import { TableFooterComponent } from '../../../_sharedresources/table-footer/table-footer.component';

@Component({
  selector: 'app-all-employees',
  standalone: true,
  imports: [
    MatButtonModule,
    RouterLink,
    NgClass,
    NgxDatatableModule,
    TableFooterComponent,
  ],
  templateUrl: './all-employees.component.html',
  styleUrl: './all-employees.component.scss',
})
export class AllEmployeesComponent implements OnInit {
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

  rows = [
    {
      idS: '1',
      phoneNumber: 'Textile',
      religion: 'Islam',
      dateOfBirth: '1990-01-01',
      registerDate: '2024-12-01',
      status: 'Active',
      gender: 'Male',
    },
    {
      idS: '3',
      phoneNumber: 'Technical',
      religion: 'Islam',
      dateOfBirth: '1990-01-01',
      registerDate: '2024-12-01',
      status: 'Active',
      gender: 'Male',
    },
    {
      idS: '4',
      phoneNumber: 'Computer',
      religion: 'Islam',
      dateOfBirth: '1990-01-01',
      registerDate: '2024-12-01',
      status: 'Active',
      gender: 'Male',
    },
    {
      idS: '5',
      phoneNumber: 'Textile',
      religion: 'Islam',
      dateOfBirth: '1990-01-01',
      registerDate: '2024-12-01',
      status: 'Active',
      gender: 'Male',
    },
    {
      idS: '6',
      phoneNumber: 'Textile',
      religion: 'Islam',
      dateOfBirth: '1990-01-01',
      registerDate: '2024-12-01',
      status: 'Active',
      gender: 'Male',
    },
    {
      idS: '7',
      phoneNumber: 'Textile',
      religion: 'Islam',
      dateOfBirth: '1990-01-01',
      registerDate: '2024-12-01',
      status: 'Active',
      gender: 'Male',
    },
    {
      idS: '8',
      phoneNumber: 'Textile',
      religion: 'Islam',
      dateOfBirth: '1990-01-01',
      registerDate: '2024-12-01',
      status: 'Active',
      gender: 'Male',
    },
    {
      idS: '9',
      phoneNumber: 'Textile',
      religion: 'Islam',
      dateOfBirth: '1990-01-01',
      registerDate: '2024-12-01',
      status: 'Active',
      gender: 'Male',
    },
    {
      idS: '10',
      phoneNumber: 'Textile',
      religion: 'Islam',
      dateOfBirth: '1990-01-01',
      registerDate: '2024-12-01',
      status: 'Active',
      gender: 'Male',
    },
    {
      idS: '11',
      phoneNumber: 'Textile',
      religion: 'Islam',
      dateOfBirth: '1990-01-01',
      registerDate: '2024-12-01',
      status: 'Active',
      gender: 'Male',
    },
    {
      idS: '12',
      phoneNumber: 'Textile',
      religion: 'Islam',
      dateOfBirth: '1990-01-01',
      registerDate: '2024-12-01',
      status: 'Active',
      gender: 'Male',
    },
    {
      idS: '13',
      phoneNumber: 'Textile',
      religion: 'Islam',
      dateOfBirth: '1990-01-01',
      registerDate: '2024-12-01',
      status: 'Active',
      gender: 'Male',
    },

    {
      idS: '1',
      phoneNumber: 'Textile',
      religion: 'Islam',
      dateOfBirth: '1990-01-01',
      registerDate: '2024-12-01',
      status: 'Active',
      gender: 'Male',
    },
    {
      idS: '3',
      phoneNumber: 'Textile',
      religion: 'Islam',
      dateOfBirth: '1990-01-01',
      registerDate: '2024-12-01',
      status: 'Active',
      gender: 'Male',
    },
    {
      idS: '4',
      phoneNumber: 'Textile',
      religion: 'Islam',
      dateOfBirth: '1990-01-01',
      registerDate: '2024-12-01',
      status: 'Active',
      gender: 'Male',
    },
    {
      idS: '5',
      phoneNumber: 'Textile',
      religion: 'Islam',
      dateOfBirth: '1990-01-01',
      registerDate: '2024-12-01',
      status: 'Active',
      gender: 'Male',
    },
    {
      idS: '6',
      phoneNumber: 'Textile',
      religion: 'Islam',
      dateOfBirth: '1990-01-01',
      registerDate: '2024-12-01',
      status: 'Active',
      gender: 'Male',
    },
    {
      idS: '7',
      phoneNumber: 'Textile',
      religion: 'Islam',
      dateOfBirth: '1990-01-01',
      registerDate: '2024-12-01',
      status: 'Active',
      gender: 'Male',
    },
    {
      idS: '8',
      phoneNumber: 'Textile',
      religion: 'Islam',
      dateOfBirth: '1990-01-01',
      registerDate: '2024-12-01',
      status: 'Active',
      gender: 'Male',
    },
    {
      idS: '9',
      phoneNumber: 'Textile',
      religion: 'Islam',
      dateOfBirth: '1990-01-01',
      registerDate: '2024-12-01',
      status: 'Active',
      gender: 'Male',
    },
    {
      idS: '10',
      phoneNumber: 'Textile',
      religion: 'Islam',
      dateOfBirth: '1990-01-01',
      registerDate: '2024-12-01',
      status: 'Active',
      gender: 'Male',
    },
    {
      idS: '11',
      phoneNumber: 'Textile',
      religion: 'Islam',
      dateOfBirth: '1990-01-01',
      registerDate: '2024-12-01',
      status: 'Active',
      gender: 'Male',
    },
    {
      idS: '12',
      phoneNumber: 'Textile',
      religion: 'Islam',
      dateOfBirth: '1990-01-01',
      registerDate: '2024-12-01',
      status: 'Active',
      gender: 'Male',
    },
    {
      idS: '13',
      phoneNumber: 'Textile',
      religion: 'Islam',
      dateOfBirth: '1990-01-01',
      registerDate: '2024-12-01',
      status: 'Active',
      gender: 'Male',
    },
  ];

  // // Handle the Create button click
  onCreate() {
    console.log('Create button clicked');
  }

  setPage(pageInfo: any) {
    // this.selected = [];
    

    this.selected = [];
    this.page.pageNumber = pageInfo.offset;
    if (pageInfo.sortOn == undefined) {
      this.page.sortOn = this.page.sortOn;
    } else {
      this.page.sortOn = pageInfo.sortOn;
    }
    if (pageInfo.sortBy == undefined) {
      this.page.sortBy = this.page.sortBy;
    } else {
      this.page.sortBy = pageInfo.sortBy;
    }

    this.page.searchKeyword = '';
    // this.page, this.searchKeyword

    const body = {
      "PageIndex": 1,
      "PageSize": 10,
   
    };
    // this.subscription = this.userService.getAllUsers(body).subscribe((pagedData) => {
    //     debugger
    //     if (pagedData) {
    //       this.page.totalElements = this.page.totalElements;

    //       // this.rows = pagedData.data;
    //     }
    //   });
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
    this.setPage({ offset: 0 });
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
        this.router.navigate(['edit', event.row.id], {
          relativeTo: this.route,
        });
      }
    }
  }
  onSelect({ selected }: any) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  changePageSize(event: any) {
    this.page.size = event;
    // this.setPage({ offset: 0 });
  }

  toDelete() {
    if (this.selected.length > 0) {
      var selectedId = this.selected.map((x: any) => {
        return x.id;
      });

      const body = {
        classIds: selectedId,
      };

      // this.userService.deleteClass(body).subscribe(data => {

      //   this.setPage({ offset: 0, sortOn: this.page.sortOn, sortBy: this.page.sortBy });
      //   $('#confirmation-modal').modal('hide');
      //   if (data.code == 200 || data.code == 201) {
      //     // Utils.notification(data.btiMessage.message, 'success');
      //     this.toastr.success('Delete SuccessFully');
      //   } else {
      //     // Utils.notification(data.btiMessage.message, 'error');
      //     this.toastr.error('Falled');

      //   }
      // })
    }
  }
}
