import { Component, inject } from '@angular/core';
import { Utils } from '../../../utils';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DevicesService } from '../../_services/devices/devices.service';
import { Page } from '../../../_sharedresources/page';
import { ColumnMode, NgxDatatableModule, SelectionType } from '@swimlane/ngx-datatable';
import { MatButtonModule } from '@angular/material/button';
import { NgClass, NgIf } from '@angular/common';
import { TableFooterComponent } from '../../../_sharedresources/table-footer/table-footer.component';
import { QRCodeModule } from 'angularx-qrcode';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CompanyService } from '../../_services/companies/company.service';
import { LocationService } from '../../_services/location/location.service';
import { OrganizationService } from '../../_services/organization/organization.service';
import { UserServiceService } from '../../_services/user-service.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DateService } from '../../../_sharedresources/date-service/date.service';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ShiftAssignService } from '../../_services/shift-assign/shift-assign.service';
import { GlobalApiCallService } from '../../../_sharedresources/_services/global-api-call.service';

@Component({
  selector: 'app-attendance-view',
  standalone: true,
  imports: [
    MatButtonModule,
    RouterLink,
    NgClass,
    NgxDatatableModule,
    TableFooterComponent,
    QRCodeModule,
    FormsModule,
    NgSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    NgIf,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './attendance-view.component.html',
  styleUrl: './attendance-view.component.scss'
})
export class AttendanceViewComponent {
  readonly utils = inject(Utils);
  // readonly locationService = inject(LocationService);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly deviceService = inject(DevicesService);
  readonly companyService = inject(CompanyService);
  readonly locationService = inject(LocationService);
  readonly organizationService = inject(OrganizationService);
  readonly userService = inject(UserServiceService);
  readonly dateService = inject(DateService);
  readonly shiftAssignService = inject(ShiftAssignService)
   readonly globalApiService = inject(GlobalApiCallService);
 

  today: Date = new Date();
  locationData: any;

  selectedLocation: any
  locationArray: any = [];
  deviceData: any;

  organizationData: any;
  selectedOrganization: any
  organizationArray: any = [];

  companyData: any;
  selectedCompany: any
  companyArray: any = [];

  selectedCompanyLocation: any
  selectedClientCompanyLocation: any
  companylocationArray: any = [];
  clietnCompanyLocationArray: any = [];

  selectedDevice: any;
  userArray: any = [];
  selectedUser: any;
  userData: any

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

  payPeriodArray: any = [
    { id: 1, name: 'Pay Period' },
    { id: 2, name: 'Last Pay Period' },
    { id: 3, name: 'Last Two Pay Period' },
  ];

  shiftArray: any
  selectedShift: any
  shiftData: any

  selectedPayPeriod: any

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  isActive?: boolean;
  isOrganization?: boolean;

  DeviceArray: any = [];
  toDate: any
  fromDate: any
  toDateValue: any
  fromDateValue: any;
  minToDate: Date | null = null;
  maxFromDate: Date | null = null;

  rows: any = [];
  // // Handle the Create button click
  onCreate() {
    console.log('Create button clicked');
  }

  setPage(pageInfo: any, flag?: any) {
    // this.selected = [];
    this.rows = [];
    this.utils.showLoader();
    // if (!this.selectedDevice) {
    //   this.utils.notification('Please Select Device', 'error');
    //   this.utils.hideLoader();
    //   return
    // }

    if (this.orgIdFromLocalHost) {
      var orgId = this.orgIdFromLocalHost
    } else {
      var orgId = this.selectedOrganization?.id
    }


    if (!this.fromDate && this.toDate) {
      this.utils.notification('Please Select From Date', 'error');
      this.utils.hideLoader();
      return
    }

    this.selected = [];
    var pIndex = pageInfo.offset + 1;
    this.page.pageNumber = pageInfo.offset
    this.page.pageIndex = pageInfo.offset
    this.page.searchKeyword = this.searchKeyword;


    this.page.searchTerm = '';

    if (this.selectedOrganization) {
      var orgId = this.selectedOrganization.id
    } else if (this.orgIdFromLocalHost) {
      orgId = this.orgIdFromLocalHost
    }

    if (this.selectedUser && this.selectedUser.length > 0) {
      var selectedUserObjs = this.selectedUser.map((x: any) => {
        return {
          UserId: (x.id.toString())
        }
      })
    }



    if (this.fromDate) {
      var fDate = this.dateService.formatDate(this.fromDate, 'yyyy-MM-dd');
    }

    if (this.toDate) {
      var tDate = this.dateService.formatDate(this.toDate, 'yyyy-MM-dd');
    }



    const body = {
      id: this.selectedDevice?.id || null,
      selectedUserObjs: selectedUserObjs && selectedUserObjs.length ? selectedUserObjs : null,
      fromDate: fDate || null,
      toDate: tDate || null,
      searchKeyword: '',
      payPeriod: this.selectedPayPeriod ? this.selectedPayPeriod.id : null,
      shiftId: this.selectedShift ? this.selectedShift.id : null,

      organizatonId: orgId ? orgId : null,
      organizationLocationId: this.selectedCompanyLocation?.id || null,
      companyId: this.selectedCompany?.id || null,
      companyLocatonId: this.selectedClientCompanyLocation?.id || null

    }


    this.subscription = this.deviceService.getAllAttendacneData(body).subscribe((pagedData) => {
      if (pagedData && pagedData.Result && pagedData.Result.length) {
        var filteredRows = pagedData.Result;

        this.rows = [...filteredRows]
        this.page.totalElements = this.rows && this.rows.length ? this.rows.length : 0;

        if (this.rows && this.rows.length == 0) {
          this.utils.notification('No Data Found', 'error');
          this.utils.hideLoader();

        }
      } else {
        this.utils.notification('Data not found', 'error')
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
  currentUserId: any
  orgIdFromLocalHost: any
  currentUserRole: any

  ngOnInit(): void {
    // this.utils.showLoader()



    const userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null;
    this.currentUserId = userData.Id
    this.currentUserRole = userData.Role;
    this.orgIdFromLocalHost = userData.OrganizationId


    this.getAllOrganization();
    // this.getAllCompany();
    this.getAllLocation();
    this.getCompanyLocation();
    if (this.currentUserRole == 'Admin') {
      this.onOrganizationChange(this.orgIdFromLocalHost);
    }

    // if(this.currentUserRole == 'Admin' && this.orgIdFromLocalHost){
    //   this.setPage({ offset: 0 }, true);
    // }else {
    //   this.setPage({ offset: 0 }, true);
    // }


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
        this.router.navigate(['/main/attendance/device/edit', event.row.Id]);
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

    const body = {
      id: this.selected[0].Id,
    };


    this.deviceService.deleteDevice(body).subscribe(data => {

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

      IsFacial: false,
      IsBiometric: false,
      IsSSN: true,
      IsLastName: false,

      orgTimeZoneId: row.OrganizationLocation?.TimeZone?.TimeZoneId ?? null,
      orgTimeZoneName: row.OrganizationLocation?.TimeZone?.Name ?? null,
      orgTimeZoneDifference: row.OrganizationLocation?.TimeZone?.TimeDifference ?? null,

      comTimeZoneId: row.CompanyLocation?.TimeZone?.TimeZoneId ?? null,
      comTimeZoneName: row.CompanyLocation?.TimeZone?.Name ?? null,
      comTimeZoneDifference: row.CompanyLocation?.TimeZone?.TimeDifference ?? null,


      userId: row?.UserId ?? null,
      attendanceType: 'finger',

      locationId: row.Location?.Id ?? null,



    }

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


  setStatus(status?: boolean) {
    this.isActive = status;
    this.setPage({ offset: 0 });
  }

  getIsCompanies(isCompany?: boolean) {
    this.isOrganization = isCompany;
    this.setPage({ offset: 0 });
  }
  onOrganizationChange(id?: any) {
    this.selectedCompany = null;
    this.selectedClientCompanyLocation = null;
    this.clietnCompanyLocationArray = []
    this.selectedCompanyLocation = null;
    this.companylocationArray = [];
    this.selectedDevice = null;
    this.DeviceArray = [];
    this.selectedUser = null;
    this.userArray = [];
    this.selectedUser = null;
    this.userArray = [];

    this.companyService.getAllCompanysDrop(id).subscribe(res => {
      if (res && res.StatusCode == 200) {
        this.companyData = res.Result;
        var filteredRows = this.companyData.filter(row => row.IsActive);

        this.companyArray = filteredRows.map((item: any) => ({
          id: item.Id,
          name: item.Name
        }));
      }

      // if(this.mode == 'edit'){
      //   this.selectedCompany = this.companyArray.find(
      //     (x) => x.id === this.rowsData.CompanyId
      //   );
      //   this.onComnpanyChange(this.selectedOrganization?.id, this.selectedCompany?.id);
      // }


    })

    // this.locationService.getAllLocationsDrop(id).subscribe(res => {
    //   if (res && res.StatusCode == 200) {
    //     this.locationData = res.Result;
    //     var filteredRows = this.locationData.filter(row => row.IsActive);

    //     this.locationArray = filteredRows.map((item: any) => ({
    //       id: item.Id,
    //       name: item.Name
    //     }));
    //   }

    // })

    if (id && !this.selectedCompany) {
      this.getCompanyLocation(id);
      // this.getAllDevice(id);
    }


    if (this.selectedCompany) {
      this.getClientCompanyLocation();
    }

    if (!this.selectedOrganization) {
      this.showDevices();
      this.showUsers();
    }


  }

  onComnpanyChange(orgId: any, comId: any) {

    this.selectedClientCompanyLocation = null;
    this.clietnCompanyLocationArray = []
    this.selectedDevice = null;
    this.DeviceArray = [];
    this.selectedUser = null;
    this.userArray = [];

    if (this.currentUserRole === 'Admin') {

      orgId = this.orgIdFromLocalHost;
    }

    if (this.selectedCompany) {
      this.getClientCompanyLocation();
      // this.getAllDevice(this.selectedOrganization?.id);
    }

    if (!this.selectedCompany) {
      this.showDevices();
      this.showUsers();
    }

  }

  onUserChange(event) {
    this.rows = null;
  }

  onDeviceChange(event) {
    this.rows = null;

  }

  getClientCompanyLocation() {
    this.locationService.getAllLocationsDrop('', this.selectedCompany?.id, false).subscribe(res => {
      if (res && res.StatusCode == 200) {
        this.locationData = res.Result;
        var filteredRows = this.locationData.filter(row => row.IsActive);

        this.clietnCompanyLocationArray = filteredRows.map((item: any) => ({
          id: item.Id,
          name: item.Name
        }));
      }

      // if(this.clietnCompanyLocationArray && this.mode == 'edit' && this.rowsData.CompanyLocationId){
      //   this.selectedClientCompanyLocation = this.clietnCompanyLocationArray.find(
      //     (x) => x.id === this.rowsData.CompanyLocationId
      //   )
      // }

    })
  }

  getCompanyLocation(id?) {

    var isOrganizationLocation: boolean = true
    if (this.orgIdFromLocalHost) {
      var orgId = this.orgIdFromLocalHost
    } else {
      var orgId = id
    }

    this.locationService.getAllLocationsDrop(orgId, this.selectedCompany?.id, isOrganizationLocation).subscribe(res => {
      if (res && res.StatusCode == 200) {
        this.locationData = res.Result;
        var filteredRows = this.locationData.filter(row => row.IsActive);

        this.companylocationArray = filteredRows.map((item: any) => ({
          id: item.Id,
          name: item.Name
        }));
      }


      // if(this.companylocationArray && this.mode == 'edit' && this.rowsData.OrganizationLocationId){
      //   this.selectedCompanyLocation = this.companylocationArray.find(
      //     (x) => x.id === this.rowsData.OrganizationLocationId
      //   )
      // }

    })
  }

  getAllDevice(id) {

    var isOrganizationLocation: boolean = true
    if (this.orgIdFromLocalHost) {
      var orgId = this.orgIdFromLocalHost
    } else {
      var orgId = id
    }

    this.deviceService.getAllDeviceDrop(orgId, this.selectedCompany?.id, this.isActive, isOrganizationLocation).subscribe(res => {
      if (res && res.StatusCode == 200) {
        this.deviceData = res.Result;
        var filteredRows = res.Result;
        // var filteredRows = this.deviceData.filter(row => row.IsActive);

        this.DeviceArray = filteredRows.map((item: any) => ({
          id: item.Id,
          name: item.Name
        }));
      }


      // if(this.companylocationArray && this.mode == 'edit' && this.rowsData.OrganizationLocationId){
      //   this.selectedCompanyLocation = this.companylocationArray.find(
      //     (x) => x.id === this.rowsData.OrganizationLocationId
      //   )
      // }

    })
  }

  toggleStatus(row: any): void {
    // this.utils.showLoader();
    if (row.IsActive == false) {
      row.IsActive = true;
      this.deviceService.addEditDevice(row).subscribe(res => {
        if (res && res.StatusCode == 200) {
          this.utils.notification('Device Active Successfully.', 'success');
          this.setPage({ offset: 0 });
          this.utils.hideLoader();
        }
      })
    }
    else {
      const body = {
        id: row.Id,
      };

      this.deviceService.deleteDevice(body).subscribe(data => {

        this.setPage({ offset: 0 });
        // $('#confirmation-modal').modal('hide');
        if (data.StatusCode == 200) {
          // Utils.notification(data.btiMessage.message, 'success');
          this.utils.notification('Device InAcitve Successfully.', 'success');
          this.setPage({ offset: 0 });

        } else {
          // Utils.notification(data.btiMessage.message, 'error');
          this.utils.notification('Falled', 'error');

        }
      })
    }

    this.utils.hideLoader();
  }


  getAllOrganization() {
    this.utils.showLoader();

    this.organizationService.getAllOrganizationDrop().subscribe(res => {
      if (res && res.StatusCode == 200) {

        this.organizationData = res.Result;

        this.organizationArray = this.organizationData.map((item: any) => ({
          id: item.Id,
          name: item.Name
        }));
        this.utils.hideLoader();

      } else {
        this.utils.hideLoader();
      }
    }, (error) => {
      this.utils.hideLoader();
    })
  }

  getAllCompany() {
    this.companyService.getAllCompanysDrop().subscribe(res => {
      if (res && res.StatusCode == 200) {
        this.companyData = res.Result;
        var filteredRows = this.companyData.filter(row => row.IsActive);
        this.companyArray = filteredRows.map((item: any) => ({
          id: item.Id,
          name: item.Name
        }));
      }
    })
  }

  getAllShiftsDropdownValue(status, orgId, orgLocId, comId?, comLocId?){
    
    this.selectedShift = null;
    this.shiftArray = [];

    if(this.selectedCompany && this.selectedOrganization){
      var isOrganizationLocation: boolean = false
    }

    if(this.selectedCompany && !this.selectedOrganization){
      isOrganizationLocation = true
    }

    if(this.orgIdFromLocalHost){
       var cOrgId = this.orgIdFromLocalHost
    }else {
       cOrgId = this.selectedOrganization?.id
    }


    this.shiftAssignService.getAllShiftsDrop(cOrgId, comId, this.isActive, isOrganizationLocation, orgLocId,  comLocId).subscribe(res => {
      if (res && res.StatusCode == 200 && res.Result) {

        this.shiftData = res.Result;

        this.shiftArray = this.shiftData.map((item: any) => ({
          id: item.Id,
          name: item.Name
        }));

        this.shiftArray = [...this.shiftArray];

      }
    })
  }
 

  showShift(status: any){

    if(!this.selectedClientCompanyLocation || !this.selectedCompanyLocation){
      this.selectedShift = null;
      this.shiftArray = [];
    }

    if((this.selectedOrganization || this.orgIdFromLocalHost) && this.selectedCompanyLocation){
      this.getAllShiftsDropdownValue(status, this.selectedOrganization?.id, this.selectedCompanyLocation?.id)
    }

    if(this.selectedCompany && this.selectedClientCompanyLocation){
      this.getAllShiftsDropdownValue(status, this.selectedOrganization?.id, this.selectedCompanyLocation?.id, this.selectedCompany?.id, this.selectedClientCompanyLocation?.id)
    }
  }


  getAllLocation() {

    this.locationService.getAllLocationsDrop().subscribe(res => {
      if (res && res.StatusCode == 200) {

        this.locationData = res.Result;

        this.locationArray = this.locationData.map((item: any) => ({
          id: item.Id,
          name: item.Name
        }));

      }
      this.utils.hideLoader();
    })
  }


  onCompanyLocationChange(comLocationId: any) {
    var isOrganizationLocation: boolean = true
    if (this.orgIdFromLocalHost) {
      var orgId = this.orgIdFromLocalHost
    } else {
      var orgId = this.selectedOrganization?.id
    }
    this.selectedDevice = null;
    this.DeviceArray = [];

    this.showDevices();
    this.showUsers();
    this.showShift(false);

  }

  onClientCompanyLocationChange(clientComLocationId: any) {
    var isOrganizationLocation: boolean = true
    if (this.orgIdFromLocalHost) {
      var orgId = this.orgIdFromLocalHost
    } else {
      var orgId = this.selectedOrganization?.id
    }
    this.selectedDevice = null;
    this.DeviceArray = [];

    this.showDevices();
    this.showUsers();
    this.showShift(false);


  }

  onDateChange(event: any, type: string) {

    this.rows = null

    const selectedDate = this.dateService.formatDate(event.value, 'yyyy-MM-dd');

    if (type === 'from') {
      // this.fromDate = selectedDate;
      this.fromDateValue = selectedDate;
      this.minToDate = new Date(event.value);
    } else if (type === 'to') {
      // this.toDate = selectedDate;
      this.toDateValue = selectedDate;
      this.maxFromDate = new Date(event.value);
    }
  }

  getFromDateMax() {
    return this.maxFromDate ? this.maxFromDate : this.today;
  }
  


  // getAllDevicesDropdownValue(orgId, orgLocId, comId?, comLocId?) {
  //   this.DeviceArray = [];
  //   this.selectedDevice = null;

  //   if (this.selectedCompany && this.selectedOrganization) {
  //     var isOrganizationLocation: boolean = false
  //   }

  //   if (this.selectedCompany && !this.selectedOrganization) {
  //     isOrganizationLocation = true
  //   }

  //   if (this.orgIdFromLocalHost) {
  //     var cOrgId = this.orgIdFromLocalHost
  //   } else {
  //     cOrgId = this.selectedOrganization?.id
  //   }

  //   this.deviceService.getAllDeviceDrop(cOrgId, comId, this.isActive, isOrganizationLocation, orgLocId, comLocId).subscribe(res => {
  //     if (res && res.StatusCode == 200) {
  //       this.deviceData = res.Result;
  //       var filteredRows = res.Result;
  //       // var filteredRows = this.deviceData.filter(row => row.IsActive);

  //       this.DeviceArray = filteredRows.map((item: any) => ({
  //         id: item.Id,
  //         name: item.Name
  //       }));
  //     }


  //   })
  // }

  latestDeviceCallTimestamp: number = 0; // Track the latest API call timestamp

  getAllDevicesDropdownValue(orgId, orgLocId, comId?, comLocId?) {
    const currentTimestamp = Date.now(); // Capture current time for this API call
    this.latestDeviceCallTimestamp = currentTimestamp; // Store the latest call timestamp

    this.DeviceArray = [];
    this.selectedDevice = null;

    let isOrganizationLocation = this.selectedCompany && !this.selectedOrganization;
    let cOrgId = this.orgIdFromLocalHost ? this.orgIdFromLocalHost : this.selectedOrganization?.id;

    this.deviceService.getAllDeviceDrop(cOrgId, comId, this.isActive, isOrganizationLocation, orgLocId, comLocId)
      .subscribe(res => {
        if (res && res.StatusCode == 200) {
          // Ensure we only update DeviceArray if this is the latest API response
          if (currentTimestamp === this.latestDeviceCallTimestamp) {
            this.deviceData = res.Result;
            this.DeviceArray = this.deviceData.map((item: any) => ({
              id: item.Id,
              name: item.Name
            }));
          }
        }
      });
  }


  clearDate() {
    this.fromDate = null; // Clears the from date
    this.fromDateValue = null;
    this.minToDate = null;
  }

  clearToDate() {
    this.toDate = null; // Clears the to date
    this.toDateValue = null;
    this.maxFromDate = null;
  }

  // getAllUserDropDownValue(orgId, orgLocId, comId?, comLocId?) {


  //   if(this.selectedCompany && this.selectedOrganization){
  //     var isOrganizationLocation: boolean = false
  //   }

  //   if(this.selectedCompany && !this.selectedOrganization){
  //     isOrganizationLocation = true
  //   }

  //   if(this.orgIdFromLocalHost){
  //      var cOrgId = this.orgIdFromLocalHost
  //   }else {
  //      cOrgId = this.selectedOrganization?.id
  //   }

  //   this.userService.getAllUsersDrop(cOrgId, comId, this.isActive, isOrganizationLocation, orgLocId,  comLocId).subscribe(res => {

  //     if (res && res.StatusCode == 200) {
  //       this.userArray = [];
  //       this.selectedUser = null;
  //       this.userData = res.Result;
  //       var filteredRows = [];

  //       filteredRows = this.userData.map((item: any) => ({
  //         id: item.Id,
  //         name: item.FullName || item.UserName,
  //         ...item
  //       }));

  //       this.userArray = JSON.parse(JSON.stringify(filteredRows));

  //     }


  //   })
  // }

  latestAPICallTimestamp: number = 0; // Track the latest API call

  getAllUserDropDownValue(orgId, orgLocId, comId?, comLocId?) {
    const currentTimestamp = Date.now(); // Capture current time for this API call
    this.latestAPICallTimestamp = currentTimestamp; // Store the latest call timestamp

    let isOrganizationLocation = this.selectedCompany && !this.selectedOrganization;

    let cOrgId = this.orgIdFromLocalHost ? this.orgIdFromLocalHost : this.selectedOrganization?.id;

    this.userService.getAllUsersDrop(cOrgId, comId, this.isActive, isOrganizationLocation, orgLocId, comLocId)
      .subscribe(res => {
        if (res && res.StatusCode === 200) {
          // Ensure we only update the userArray if this is the latest API response
          if (currentTimestamp === this.latestAPICallTimestamp) {
            this.userArray = [];
            this.selectedUser = null;
            this.userData = res.Result;
            
            var aarr = this.userData.map((item: any) => ({
              id: item.Id,
              name: item.SsnNumber ? item.FullName + ' - ' + item.SsnNumber : item.FullName || item.UserName,
              ...item
            }));

            this.userArray = [...aarr];
            

          }
        }
      });
  }


  showDevices() {
    if ((this.selectedOrganization || this.orgIdFromLocalHost) && this.selectedCompanyLocation) {
      this.getAllDevicesDropdownValue(this.selectedOrganization?.id, this.selectedCompanyLocation?.id)
    }

    if (this.selectedCompany && this.selectedClientCompanyLocation) {
      this.getAllDevicesDropdownValue(this.selectedOrganization?.id, this.selectedCompanyLocation?.id, this.selectedCompany?.id, this.selectedClientCompanyLocation?.id)
    }
  }

  showUsers() {

    this.userArray = [];
    this.selectedUser = null;

    if ((this.selectedOrganization || this.orgIdFromLocalHost) && this.selectedCompanyLocation) {
      this.getAllUserDropDownValue(this.selectedOrganization?.id, this.selectedCompanyLocation?.id)
    }

    if (this.selectedCompany && this.selectedClientCompanyLocation) {
      this.getAllUserDropDownValue(this.selectedOrganization?.id, this.selectedCompanyLocation?.id, this.selectedCompany?.id, this.selectedClientCompanyLocation?.id)
    }
  }



  downloadReport(fileType){
   
    var isAttendance = true;
    
    if (this.selectedOrganization) {
      var orgId = this.selectedOrganization.id
    } else if (this.orgIdFromLocalHost) {
      orgId = this.orgIdFromLocalHost
    }

    if (this.selectedUser && this.selectedUser.length > 0) {
      var selectedUserObjs = this.selectedUser.map((x: any) => {
        return {
          UserId: (x.id.toString())
        }
      })
    }



    if (this.fromDate) {
      var fDate = this.dateService.formatDate(this.fromDate, 'yyyy-MM-dd');
    }

    if (this.toDate) {
      var tDate = this.dateService.formatDate(this.toDate, 'yyyy-MM-dd');
    }



    var reportBody: any = {
      id: this.selectedDevice?.id || null,
      selectedUserObjs: selectedUserObjs && selectedUserObjs.length ? selectedUserObjs : null,
      fromDate: fDate || null,
      toDate: tDate || null,
      searchKeyword: '',
      payPeriod: this.selectedPayPeriod ? this.selectedPayPeriod.id : null,
      shiftId: this.selectedShift ? this.selectedShift.id : null,

      organizatonId: orgId ? orgId : null,
      organizationLocationId: this.selectedCompanyLocation?.id || null,
      companyId: this.selectedCompany?.id || null,
      companyLocatonId: this.selectedClientCompanyLocation?.id || null,
      isAttendance: isAttendance
    };


    this.deviceService
      .downloadAttendance(reportBody, fileType)
      .then((data) => {
        this.globalApiService.downloadPrintFunctionality(
          fileType,
          data,
          "Attendance Report",
          ".page-body"
        );
      });
  }

}
