import { NgClass } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ColumnMode, NgxDatatableModule, SelectionType } from '@swimlane/ngx-datatable';
import { TableFooterComponent } from '../../../../_sharedresources/table-footer/table-footer.component';
import { Utils } from '../../../../utils';
import { UserServiceService } from '../../../_services/user-service.service';
import { HttpClient } from '@angular/common/http';
import { Page } from '../../../../_sharedresources/page';
import { DepartmentsService } from '../../../_services/departments/departments.service';

@Component({
  selector: 'app-all-departments',
  standalone: true,
  imports: [  
    MatButtonModule,
    RouterLink,
    NgClass,
    NgxDatatableModule,
    TableFooterComponent,],
  templateUrl: './all-departments.component.html',
  styleUrl: './all-departments.component.scss'
})
export class AllDepartmentsComponent {
 readonly utils = inject(Utils);
  readonly userService = inject(UserServiceService);
  readonly departmentService = inject(DepartmentsService);
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


    this.subscription = this.departmentService.getAllDepartments(this.page, pIndex, this.orgIdFromLocalHost,this.isActive,this.isOrganization).subscribe((pagedData) => {
        
        if (pagedData) {
          this.page.totalElements = pagedData.TotalPages;
          // var filteredRows = pagedData.Result.filter(row => row.IsActive);
          //  this.rows = filteredRows;
          this.rows = pagedData.Result
           
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
  currentUserRole: any;
  currentUserId: any;
  orgIdFromLocalHost: any

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.utils.showLoader();

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
        this.router.navigate(['/main/attendance/department/edit', event.row.Id]);
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
    
    // if (this.selected.length > 0) {
      // var selectedId = this.selected.map((x: any) => {
      //   return x.id;
      // });

      const body = {
        id: this.selected[0].Id,
      };


        this.departmentService.deleteDepartment(body).subscribe(data => {
  
          this.setPage({ offset: 0});
          // $('#confirmation-modal').modal('hide');
          if (data.StatusCode == 200 ) {
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

  getIsCompanies(isCompany?: boolean){
    this.isOrganization = isCompany;
    this.setPage({ offset: 0 });
  }
  // toggleStatus(row: any): void {
  //   this.utils.showLoader();
  //   if(row.IsActive == false)
  //   {
  //     row.IsActive = true;
  //     this.departmentService.addDepartment(row).subscribe(res => {
  //       if (res && res.StatusCode == 200) {
  //         this.utils.notification('Department Active Successfully.', 'success');
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

  //     this.departmentService.deleteDepartment(body).subscribe(data => {
  
  //       this.setPage({ offset: 0 });
  //       // $('#confirmation-modal').modal('hide');
  //       if (data.StatusCode == 200) {
  //         // Utils.notification(data.btiMessage.message, 'success');
  //         this.utils.notification('Department InAcitve Successfully.', 'success');
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
          this.departmentService.deleteDepartment(body).subscribe(data => {
            if (data.StatusCode === 200) {
              this.utils.notification('Department Inactive Successfully.', 'success');
            } else {
              this.utils.notification(data.CommonMessage, 'error');
              this.setPage({ offset: 0 });
            }
            this.setPage({ offset: 0 });
            this.utils.hideLoader();
          });
        } else {
          // User clicked "No" -> Revert toggle
          setTimeout(() => {
            row.IsActive = true;
            this.cdRef.detectChanges();
            this.setPage({ offset: 0 });
          }, 0);
        }
      });
    } else {
      // Directly activate without confirmation
      this.utils.showLoader();
      row.IsActive = true;
      this.departmentService.addDepartment(row).subscribe(res => {
        if (res && res.StatusCode === 200) {
          this.utils.notification('Department Activated Successfully.', 'success');
          this.setPage({ offset: 0 });
        } else {
          this.utils.notification('Failed to activate department.', 'error');
        }
        this.utils.hideLoader();
      });
    }
  }
  
  

}
