import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ColumnMode, NgxDatatableModule, SelectionType } from '@swimlane/ngx-datatable';
import { TableFooterComponent } from '../../../../_sharedresources/table-footer/table-footer.component';
import { Utils } from '../../../../utils';
import { Page } from '../../../../_sharedresources/page';
import { TimezoneService } from '../../../_services/timezone/timezone.service';

@Component({
  selector: 'app-all-timezone',
  standalone: true,
  imports: [ 
    MatButtonModule,
    RouterLink,
    NgClass,
    NgxDatatableModule,
    TableFooterComponent,
  ],
  templateUrl: './all-timezone.component.html',
  styleUrl: './all-timezone.component.scss'
})
export class AllTimezoneComponent {
readonly utils = inject(Utils);
  readonly timezoneService = inject(TimezoneService);
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


  rows: any = [];
  // // Handle the Create button click
  onCreate() {
    console.log('Create button clicked');
  }

  setPage(pageInfo: any, flag?: any) {
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



    this.subscription = this.timezoneService.getAllTimezone(this.page, pIndex).subscribe((pagedData) => {
      if (pagedData) {
         this.page.totalElements = pagedData.TotalPages;
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

  ngOnInit(): void {
    // this.utils.showLoader()

    this.setPage({ offset: 0 }, true);
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
        this.router.navigate(['/main/attendance/timezone/edit', event.row.Id]);
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


    this.timezoneService.deleteTimezone(body).subscribe(data => {

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
}
