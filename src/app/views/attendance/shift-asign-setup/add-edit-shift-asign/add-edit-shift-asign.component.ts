import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgSelectModule } from '@ng-select/ng-select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrganizationModalComponent } from '../../../../_sharedresources/modals/organization-modal/organization-modal.component';
import { LocationModalComponent } from '../../../../_sharedresources/modals/location-modal/location-modal.component';
import { CompanyModalComponent } from '../../../../_sharedresources/modals/company-modal/company-modal.component';
import { LocationService } from '../../../_services/location/location.service';
import { OrganizationService } from '../../../_services/organization/organization.service';
import { DesignationService } from '../../../_services/designation/designation.service';
import { DevicesService } from '../../../_services/devices/devices.service';
import { CompanyService } from '../../../_services/companies/company.service';
import { DateService } from '../../../../_sharedresources/date-service/date.service';
import { Utils } from '../../../../utils';
import { ShiftAssignService } from '../../../_services/shift-assign/shift-assign.service';
import { UserServiceService } from '../../../_services/user-service.service';
import { ColumnMode, NgxDatatableModule, SelectionType } from '@swimlane/ngx-datatable';
import { TableFooterComponent } from '../../../../_sharedresources/table-footer/table-footer.component';
import { Page } from '../../../../_sharedresources/page';
import { CompanyLocationModalComponent } from "../../../../_sharedresources/modals/company-location-modal/company-location-modal.component";
import { OrganizationLocationModalComponent } from "../../../../_sharedresources/modals/organization-location-modal/organization-location-modal.component";
import { MatIconModule } from '@angular/material/icon';
declare const $: any

@Component({
  selector: 'app-add-edit-shift-asign',
  standalone: true,
  imports: [FormsModule, MatIconModule, NgIf, RouterLink, NgClass, NgSelectModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, OrganizationModalComponent, CompanyModalComponent, LocationModalComponent, NgxDatatableModule, TableFooterComponent, CompanyLocationModalComponent, OrganizationLocationModalComponent],

  templateUrl: './add-edit-shift-asign.component.html',
  styleUrl: './add-edit-shift-asign.component.scss'
})
export class AddEditShiftAsignComponent {
  readonly utils = inject(Utils);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly locationService = inject(LocationService);
  readonly organizationService = inject(OrganizationService);
  readonly designationService = inject(DesignationService);
  readonly deviceService = inject(DevicesService);
  readonly companyService = inject(CompanyService);
  readonly dateService = inject(DateService);
  readonly shiftAssignService = inject(ShiftAssignService);
  readonly userService = inject(UserServiceService);


  startingDate = new Date();
  paramsId: any;
  mode: string = 'create';
  currentUserId: any;
  requiredText: string = 'This field is required';

  cityData: any;
  stateData: any;
  countryData: any;

  organizationData: any;
  selectedOrganization: any
  organizationArray: any = [];

  companyData: any;
  selectedCompany: any
  companyArray: any = [];

  locationData: any;
  selectedLocation: any
  locationArray: any = [];


  selectedCountry: any
  countryArray: any = [];

  selectedState: any
  stateArray: any = [];

  selectedCity: any
  cityArray: any = [];

  orgIdFromLocalHost: any;
  currentUserRole: any

  selectedCompanyLocation: any
  selectedClientCompanyLocation: any
  companylocationArray: any = [];
  clietnCompanyLocationArray: any = [];
  isActive: any;
  userArray: any = [];
  selectedUser: any
  userData: any;

  shiftArray: any
  selectedShift: any
  shiftData: any
  shiftDate: string;

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  selected: any = [];
  selectedArray: any = [];

  page = new Page();
  searchKeyword: any = '';
  rows: any = [];
  subscription: any;
//  messages = {
//     totalMessage: 'Records', // Custom label for total count
//   };
  isFirstTimeLoad: boolean = true;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {

    this.utils.showLoader();
    const userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null;
    this.currentUserId = userData.Id


    this.currentUserRole = userData.Role
    this.orgIdFromLocalHost = userData.OrganizationId
    // this.getAllCompany();
  

    setTimeout(() => {
      if (this.currentUserRole === 'Admin' && userData.OrganizationId) {
        this.onOrganizationChange(userData.OrganizationId);
      }
    }, 300)

    this.getAllOrganization();
    this.getAllLocation();

    // this.getAllCountry();


    this.route.params.subscribe(params => {
      if (params['id']) {
        // this.utils.showLoader();
        this.mode = 'edit';
        this.paramsId = params['id'];
      }else {
        this.isFirstTimeLoad = false
      }
    });

  }

  model: any = {}

  onSubmit(NgForm: any) {
    this.utils.showLoader();


    if (!this.rows || this.rows.length == 0) {
      this.utils.notification('User not selected', 'error');
      this.utils.hideLoader();
      return

    }




    if (this.selectedOrganization) {
      var orgId = this.selectedOrganization.id
    } else if (this.orgIdFromLocalHost) {
      orgId = this.orgIdFromLocalHost
    }



    // if (this.selected && this.selected.length > 0) {
    //   var selectedUserObjs = this.selected.map((x: any) => {
    //     return {
    //       UserId: (x.Id.toString())
    //     }
    //   })
    // }

    if (this.selectedArray && this.selectedArray.length > 0) {
      var selectedUserObjs = this.selectedArray.map((x: any) => {
        return {
          UserId: (x.Id.toString())
        }
      })
    }

    const body = {



      Id: this.paramsId ? this.paramsId : "",
      IsActive: true,
      Description: this.model?.description || '',
      ShiftId: this.selectedShift?.id ?? null,
      OrganizationId: orgId ? orgId : null,
      CompanyId: this.selectedCompany?.id ?? null,
      companyLocationId: this.selectedClientCompanyLocation?.id ?? null,
      organizationLocationId: this.selectedCompanyLocation?.id ?? null,
      UserId: this.currentUserId ? this.currentUserId : "",
      AssignUsers: selectedUserObjs ? selectedUserObjs : [],


    }


    this.shiftAssignService.addEditShiftAssign(body).subscribe(res => {
      if (res && res.StatusCode == 200) {
        this.utils.notification(res.CommonMessage, 'success');
        this.router.navigate(['/main/attendance/shift-assign']);
        this.utils.hideLoader();

      }else {
        this.utils.notification(res.CommonMessage, 'error');
        this.utils.hideLoader();

      }
    }, (error) => {
      this.utils.hideLoader();

    })
  }



  onDateChange(event) {
    this.shiftDate = this.dateService.formatDate(event.target.value, 'yyyy-MM-dd');
  }

  getAllOrganization() {
    this.organizationService.getAllOrganizationDrop().subscribe(res => {
      if (res && res.StatusCode == 200) {

        this.organizationData = res.Result;

        this.organizationArray = this.organizationData.map((item: any) => ({
          id: item.Id,
          name: item.Name
        }));

      }
      if(this.paramsId){
        this.getById(this.paramsId);
      }

      if(this.mode == 'create'){
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

  getAllUser(id, status?) {

    var isOrganizationLocation: boolean = true
    if (this.orgIdFromLocalHost) {
      var orgId = this.orgIdFromLocalHost
    } else {
      var orgId = id
    }

    this.userService.getAllUsersDrop(orgId, this.selectedCompany?.id).subscribe(res => {
      if (res && res.StatusCode == 200) {
        this.userData = res.Result;
        var filteredRows = this.userData.filter(row => row.IsActive);

        this.userArray = filteredRows.map((item: any) => ({
          id: item.Id,
          name: item.FullName || item.UserName,
          ...item
        }));
      }


      if (this.userArray && status && this.mode == 'edit' && this.rowsData.AssignUsers && this.rowsData.AssignUsers.length > 0) {


        // if(this.rowsData.AssignUsers && this.rowsData.AssignUsers.length > 0){
        //   this.selectedUser = this.userArray.filter((x) => 
        //    this.rowsData.AssignUsers.some(d => d.UserId === x.id)
        //  );

        // }

        // this.setPage({offset: 0}, status)


      }

    })
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
    }, (error) => {
      this.utils.hideLoader();

    })
  }

  getAllShift(id, status?) {

    if (this.orgIdFromLocalHost) {
      var orgId = this.orgIdFromLocalHost
    } else {
      var orgId = id
    }


    if (this.selectedOrganization && !this.selectedCompany) {
      var isOrg = true
    } else if (this.selectedOrganization && this.selectedCompany) {
      isOrg = false
    }


    this.shiftAssignService.getAllShiftsDrop(orgId, this.selectedCompany?.id, isOrg).subscribe(res => {
      if (res && res.StatusCode == 200) {

        this.shiftData = res.Result;

        this.shiftArray = this.shiftData.map((item: any) => ({
          id: item.Id,
          name: item.Name
        }));

      }

      if (this.shiftArray && status && this.mode == 'edit' && this.rowsData.ShiftId) {
        this.selectedShift = this.shiftArray.find(
          (x) => x.id === this.rowsData.ShiftId
        )
      }

      // this.utils.hideLoader();
    }, (error) => {
      this.utils.hideLoader();

    })
  }

  rowsData: any;
  getById(id: any) {
    const body = {
      id: id
    }
    this.shiftAssignService.getShiftAssignById(body).subscribe(res => {
      if (res && res.StatusCode == 200) {
        this.rowsData = res.Result;

        this.model = {
          description: this.rowsData.Description || '',

        };

        // Map dropdown values
        this.selectedOrganization = this.organizationArray.find(
          (x) => x.id === this.rowsData.OrganizationId
        );

        // this.selectedCompany = this.companyArray.find(
        //   (x) => x.id === rowsData.CompanyId
        // );

        // this.selectedLocation = this.locationArray.find(
        //   (x) => x.id === this.rowsData.LocationId
        // );


        setTimeout(() => {
          if (this.selectedOrganization) {
            this.onOrganizationChange(this.selectedOrganization?.id, true);
          }
        },)



      }
      
    }, (error) => {
      this.utils.hideLoader();

    })
  }


  onOrganizationChange(id: any, status?) {

    this.emptyAssignUsers();

    this.selectedCompany = null;
    this.selectedLocation = null;
    this.selectedClientCompanyLocation = null;
    this.clietnCompanyLocationArray = []
    this.selectedCompanyLocation = null;
    this.companylocationArray = [];
    this.selectedUser = null;
    this.userArray = []
    this.selectedShift = null;
    this.shiftArray = [];
    this.rows = null;
    this.selected = []

    if (this.selectedOrganization && !this.selectedCompany) {
      var isOrg = true
    } else if (this.selectedOrganization && this.selectedCompany) {
      isOrg = false
    }


    this.companyService.getAllCompanysDrop(id, isOrg).subscribe(res => {
      if (res && res.StatusCode == 200) {
        this.companyData = res.Result;
        var filteredRows = this.companyData.filter(row => row.IsActive);

        this.companyArray = filteredRows.map((item: any) => ({
          id: item.Id,
          name: item.Name
        }));

      }

      if (this.mode == 'edit') {
        this.selectedCompany = this.companyArray.find(
          (x) => x.id === this.rowsData.CompanyId
        );
        this.onComnpanyChange(this.selectedOrganization?.id, this.selectedCompany?.id, status);
      }


    }, (error) => {
      this.utils.hideLoader();


    })

    if (this.selectedCompany) {
      this.getClientCompanyLocation(status);
    }

    // if (id && !this.selectedCompany) {
    //   this.getCompanyLocation(id, status);
    //   this.getAllUser(id, status);
    //   // this.getAllShift(id, status);
    // }

    if (id && !this.selectedOrganization) {
      this.getCompanyLocation(id, status);
      this.getAllUser(id, status);
      // this.getAllShift(id, status);
    }

    if (this.selectedOrganization) {
      this.getCompanyLocation(this.selectedOrganization.id, status);
      this.getAllUser(this.selectedOrganization.id, status);

    }



    if (!this.selectedOrganization) {
      this.showShift(status);

    }


  }


  onComnpanyChange(orgId: any, comId: any, status?) {

    this.emptyAssignUsers();
    this.selectedClientCompanyLocation = null;
    this.clietnCompanyLocationArray = []
    this.selectedUser = null;
    this.userArray = [];
    this.selectedShift = null;
    this.shiftArray = [];
    this.rows = null;
    this.selected = [];

    if (!this.selectedCompany && !status) {
      setTimeout(() => {
        // this.getAllShift(this.selectedOrganization?.id, false);
        this.getAllUser(this.selectedOrganization?.id, false);
      }, 500)
    }


    if (this.currentUserRole === 'Admin') {
      orgId = this.orgIdFromLocalHost;
    }

    if (this.selectedCompany) {
      this.getClientCompanyLocation(status);
    }

    if (orgId && this.selectedCompany) {
      this.getAllUser(this.selectedOrganization?.id, status);
      // this.getAllShift(this.selectedOrganization?.id, status);
    }

    if (!this.selectedCompany) {
      this.showShift(status);
    }


  }

  getCompanyLocation(id, status) {

    var isOrganizationLocation: boolean = true
    if (this.orgIdFromLocalHost) {
      var orgId = this.orgIdFromLocalHost
    } else {
      var orgId = id
    }


    if (this.selectedOrganization && !this.selectedCompany) {
      var isOrg = true
    } else if (this.selectedOrganization && this.selectedCompany) {
      isOrg = false
    }

    this.locationService.getAllLocationsDrop(orgId, this.selectedCompany?.id, isOrganizationLocation, isOrg).subscribe(res => {
      if (res && res.StatusCode == 200) {
        this.locationData = res.Result;
        var filteredRows = this.locationData.filter(row => row.IsActive);

        this.companylocationArray = filteredRows.map((item: any) => ({
          id: item.Id,
          name: item.Name
        }));
      }


      if (this.companylocationArray && this.mode == 'edit' && this.rowsData.OrganizationLocationId) {
        this.selectedCompanyLocation = this.companylocationArray.find(
          (x) => x.id === this.rowsData.OrganizationLocationId
        )

        this.showShift(status);
      }

    })
  }
  getClientCompanyLocation(status) {

    if (this.selectedOrganization && !this.selectedCompany) {
      var isOrg = true
    } else if (this.selectedOrganization && this.selectedCompany) {
      isOrg = false
    }

    this.locationService.getAllLocationsDrop('', this.selectedCompany?.id, false, isOrg).subscribe(res => {
      if (res && res.StatusCode == 200) {
        this.locationData = res.Result;
        var filteredRows = this.locationData.filter(row => row.IsActive);

        this.clietnCompanyLocationArray = filteredRows.map((item: any) => ({
          id: item.Id,
          name: item.Name
        }));
      }

      if (this.clietnCompanyLocationArray && this.mode == 'edit' && this.rowsData.CompanyLocationId) {
        this.selectedClientCompanyLocation = this.clietnCompanyLocationArray.find(
          (x) => x.id === this.rowsData.CompanyLocationId
        )
        this.showShift(status);

      }

    })
  }

  setPage(pageInfo: any, flag?: any) {
    this.utils.showLoader();
    if (this.selectedOrganization && !this.selectedCompanyLocation && !this.isFirstTimeLoad) {
      this.utils.notification('Please select Company Location', 'error');
      this.utils.hideLoader();
      return
    }

    // if(this.selectedOrganization && this.selectedCompany && !this.selectedClientCompanyLocation ){
    //   this.utils.notification('Please select Client Company Location', 'error');
    //   return 
    // }

    // if(this.currentUserRole == 'SuperAdmin' && !this.selectedOrganization){
    //   this.utils.notification('Please select Company', 'error');
    //   return 
    // }

    if (!this.selectedShift && !this.isFirstTimeLoad) {
      this.utils.notification('Please select Shift', 'error');
      this.utils.hideLoader();

      return
    }

    // if(this.currentUserRole !== 'SuperAdmin' && !this.selectedCompany){
    //   this.utils.notification('Please select Client Company', 'error');
    //   return 
    // }

    if (this.orgIdFromLocalHost) {
      var orgId = this.orgIdFromLocalHost
    } else {
      orgId = this.selectedOrganization?.id
    }

    if (this.selectedOrganization && !this.selectedCompany) {
      var isOrg = true
    } else if (this.selectedOrganization && this.selectedCompany) {
      isOrg = false
    }

    this.selected = [];
    var pIndex = pageInfo.offset + 1;
    this.page.pageNumber = pageInfo.offset
    this.page.pageIndex = pageInfo.offset
    this.page.searchKeyword = this.searchKeyword;


    this.page.searchTerm = '';


    this.subscription = this.userService.getAllUsersForShiftAssign(this.page, pIndex, orgId, this.selectedCompany?.id, isOrg, true).subscribe((pagedData) => {
      this.isFirstTimeLoad = false
      if (pagedData && pagedData.Result && pagedData.Result.length) {
        this.rows = pagedData.Result
        this.setRows(this.rows);
        this.selectedArray = [];
        this.page.totalElements = this.rows ? this.rows.length : this.rows.length;



        if (this.mode == 'edit' && this.rows && this.rows.length > 0, flag) {
        
          var selVal = []
          // if (this.rowsData.AssignUsers && this.rowsData.AssignUsers.length > 0) {
          //   selVal = this.rows.filter((row) =>
          //     this.rowsData.AssignUsers.some((assignUser) => assignUser.UserId === row.Id)
          //   );


          //   setTimeout(() => {
          //     this.selected = [...selVal]; // Force Angular to detect changes
          //   }, 0);
          // }

          if (this.rowsData.AssignUsers && this.rowsData.AssignUsers.length > 0) {
            // Create a new array for selected users
            this.selectedArray = [];
          
            // Filter out matched users from rows and move them to selectedArray
            this.rows = this.rows.filter((row) => {
              const isAssigned = this.rowsData.AssignUsers.some((assignUser) => assignUser.UserId === row.Id);
              
              if (isAssigned) {
                this.selectedArray.push(row); // Move to selectedArray
              }
          
              return !isAssigned; // Keep only unmatched users in rows
            });

            this.setRows(this.rows);

          }
          


        }
        this.utils.hideLoader();


        // var filteredRows = pagedData.Result.filter(row => row.IsActive);
      } else {
        this.utils.notification('No Data Found', 'error');
        this.utils.hideLoader();

      }


    }, (error) => {
      this.utils.hideLoader();
    });
  }


  onClear() {
    // Logic for clearing the form
    this.model = {};
    this.selectedClientCompanyLocation = null;
    this.selectedCompanyLocation = null;
    this.selectedOrganization = null;
    this.selectedCompany = null;
    this.selected = [];

  }

  getAllShiftsDropdownValue(status, orgId, orgLocId, comId?, comLocId?) {

    this.selectedShift = null;
    this.shiftArray = [];

    if (this.selectedCompany && this.selectedOrganization) {
      var isOrganizationLocation: boolean = false
    }

    if (this.selectedCompany && !this.selectedOrganization) {
      isOrganizationLocation = true
    }

    if (this.orgIdFromLocalHost) {
      var cOrgId = this.orgIdFromLocalHost
    } else {
      cOrgId = this.selectedOrganization?.id
    }


    this.shiftAssignService.getAllShiftsDrop(cOrgId, comId, this.isActive, isOrganizationLocation, orgLocId, comLocId).subscribe(res => {
      if (res && res.StatusCode == 200 && res.Result) {

        this.shiftData = res.Result;

        this.shiftArray = this.shiftData.map((item: any) => ({
          id: item.Id,
          name: item.Name
        }));

        this.shiftArray = [...this.shiftArray];

      }

      if (this.shiftArray && status && this.mode == 'edit' && this.rowsData.ShiftId) {
        this.selectedShift = this.shiftArray.find(
          (x) => x.id === this.rowsData.ShiftId
        )

        this.setPage({ offset: 0 }, status)


      }

      this.utils.hideLoader();
    })
  }


  onSelect({ selected }: any) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onSearch(event: any) {
    this.searchKeyword = event.target.value;
    this.setPage({ offset: 0 });
  }


  changePageSize(event: any) {

    this.page.size = event;
    // this.setPage({ offset: 0 });
  }

  showShift(status: any) {
    this.emptyAssignUsers();
    // if(!this.selectedClientCompanyLocation && this.selectedCompany){
    //  this
    // }

    // if(!this.selectedCompanyLocation){
    //   this.selectedOrganization = null;
    //   this.organizationArray = [];
    // }

    if (!this.selectedClientCompanyLocation || !this.selectedCompanyLocation) {
      this.selectedShift = null;
      this.shiftArray = [];
    }

    if ((this.selectedOrganization || this.orgIdFromLocalHost) && this.selectedCompanyLocation) {
      this.getAllShiftsDropdownValue(status, this.selectedOrganization?.id, this.selectedCompanyLocation?.id)
    }

    if (this.selectedCompany && this.selectedClientCompanyLocation) {
      this.getAllShiftsDropdownValue(status, this.selectedOrganization?.id, this.selectedCompanyLocation?.id, this.selectedCompany?.id, this.selectedClientCompanyLocation?.id)
    }
  }

  isOrgAdded(event: any){
    if(true){
      this.selectedOrganization = null
      this.selectedCompany = null;
      this.organizationService.getAllOrganizationDrop().subscribe(res => {
        if (res && res.StatusCode == 200) {
          this.organizationData = res.Result;
          var filteredRows = this.organizationData.filter(row => row.IsActive);
          this.organizationArray = filteredRows.map((item: any) => ({
            id: item.Id,
            name: item.Name
          }));
        }
  
      })
    }

  }


  isComAdded(event: any){
    if(true){
      this.selectedCompany = null;
      this.selectedOrganization = null;

      if(this.selectedOrganization){
        var orgId = this.selectedOrganization.id
      }else if(this.orgIdFromLocalHost){
         orgId = this.orgIdFromLocalHost
      }


      this.companyService.getAllCompanysDrop(orgId).subscribe(res => {
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

  }

  isComLocAdded(event: any, status?){
    if(true){
      this.selectedClientCompanyLocation = null;
      this.clietnCompanyLocationArray = [];
      this.selectedCompanyLocation = null;
      this.companylocationArray = [];
      this.selectedOrganization = null;
      this.selectedCompany = null;

    }

    if(status == 'org' && this.currentUserRole === 'Admin'){

      var isOrganizationLocation: boolean = true
      if(this.orgIdFromLocalHost){
        var orgId = this.orgIdFromLocalHost
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
  
     
      })

    }

  }


  searchTerm: string = '';
  showAddButton: boolean = false;
  showComAddButton: boolean = false;


  onSearchDrop(searchText: any, itemValue: any, itemNameKey: string = 'name') {
    this.searchTerm = searchText.term; // Store the search term

    // If the search term is empty, show the "Add" button again
    if (this.searchTerm) {
      this.showAddButton = !itemValue.some(item => 
        item[itemNameKey].toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      // If the search term is cleared, show the "Add" button again
      this.showAddButton = false;
    }
  }

  onDropdownClose(){
    this.showAddButton = false
    this.showComAddButton = false
  }

  onDropdownOpen(){
    this.showAddButton = false
    
  }  

  createOrganization() {
    $('#organization-modal').modal('show');
  }
  createCompanyLocation(){
    $('#company-location-modal').modal('show');
  }
  createOrgLocation(){
    $('#organization-location-modal').modal('show');
  }

  createCompany() {
    $('#company-modal').modal('show');
  }


  onShiftChange() {
    this.emptyAssignUsers();
  }

  selectedUsers: any[] = [];
  selectUser(row: any) {
    const index = this.rows.findIndex(user => user.Id === row.Id);
    
  
    if (index !== -1) {
      // Remove user from rows
      const selectedUser = this.rows.splice(index, 1)[0];
  
      // Add user to selectedArray and trigger change detection
      this.selectedArray = [...this.selectedArray, selectedUser]; // ✅ Updates reference
  
      // Also, update rows to ensure change detection works
      this.rows = [...this.rows];
      this.setRows(this.rows);
    }
  }
  
  

  removeUser(row: any) {
    // Find the index of the user in selectedArray
    const index = this.selectedArray.findIndex(user => user.Id === row.Id);
  
    if (index !== -1) {
      // Remove user from selectedArray
      const removedUser = this.selectedArray.splice(index, 1)[0];
  
      // Add user back to rows
      this.rows = [...this.rows, removedUser]; 
      this.selectedArray = [...this.selectedArray];
      this.setRows(this.rows)
    }
  }


  originalRows: any[] = [];
  setRows(data: any[]) {
    this.originalRows = [...data]; // Update originalRows whenever rows change
    this.rows = [...data]; // Update rows with new data
  }


  emptyAssignUsers(){
    this.rows = [];
    this.selectedArray = [];
    this.setRows(this.rows);
  }

  onSearchUsers(event: any) {
    const searchText = event.target.value.toLowerCase().trim();
  
    if (!searchText) {
      this.rows = [...this.originalRows]; // Reset to original rows if search is empty
      return;
    }
  
    this.rows = this.originalRows.filter(row =>
      row.FullName.toLowerCase().includes(searchText) || 
      row.Role.toLowerCase().includes(searchText)
    );
  }
  
  


}


