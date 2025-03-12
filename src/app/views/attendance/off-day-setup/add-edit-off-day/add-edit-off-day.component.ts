import { Component, inject } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgSelectModule } from '@ng-select/ng-select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Utils } from '../../../../utils';
import { LocationService } from '../../../_services/location/location.service';
import { HolidayService } from '../../../_services/holiday/holiday.service';
import { OrganizationService } from '../../../_services/organization/organization.service';
import { DesignationService } from '../../../_services/designation/designation.service';
import { DevicesService } from '../../../_services/devices/devices.service';
import { CompanyService } from '../../../_services/companies/company.service';
import { DateService } from '../../../../_sharedresources/date-service/date.service';
import { CompanyModalComponent } from '../../../../_sharedresources/modals/company-modal/company-modal.component';
import { LocationModalComponent } from '../../../../_sharedresources/modals/location-modal/location-modal.component';
import { OrganizationModalComponent } from '../../../../_sharedresources/modals/organization-modal/organization-modal.component';
import { OffDayService } from '../../../_services/off-day/off-day.service';
import { ShiftAssignService } from '../../../_services/shift-assign/shift-assign.service';
import { CompanyLocationModalComponent } from "../../../../_sharedresources/modals/company-location-modal/company-location-modal.component";
import { OrganizationLocationModalComponent } from "../../../../_sharedresources/modals/organization-location-modal/organization-location-modal.component";
declare const $: any

@Component({
  selector: 'app-add-edit-off-day',
  standalone: true,
  imports: [FormsModule, NgIf, RouterLink, NgClass, NgSelectModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, OrganizationModalComponent, CompanyModalComponent, LocationModalComponent, CompanyLocationModalComponent, OrganizationLocationModalComponent],

  templateUrl: './add-edit-off-day.component.html',
  styleUrl: './add-edit-off-day.component.scss'
})
export class AddEditOffDayComponent {
  readonly utils = inject(Utils);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly locationService = inject(LocationService);
  readonly offDayService = inject(OffDayService);
  readonly organizationService = inject(OrganizationService);
  readonly designationService = inject(DesignationService);
  readonly deviceService = inject(DevicesService);
  readonly companyService = inject(CompanyService);
  readonly dateService = inject(DateService);
  readonly shiftAssignService = inject(ShiftAssignService);


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

  daysArray: any = [];
  selectedDays: any;
  daysData: any;


  shiftArray: any
  selectedShift: any
  shiftData: any
  shiftDate: string;
  isActive: any;



  ngOnInit(): void {

    this.utils.showLoader();
    const userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null;
    this.currentUserId = userData.Id

    this.currentUserRole = userData.Role
    this.orgIdFromLocalHost = userData.OrganizationId
    this.getAllDays();
    // this.getAllCountry();
    // this.getAllCompany();


    setTimeout(() => {
      if (this.currentUserRole === 'Admin' && userData.OrganizationId) {
        this.onOrganizationChange(userData.OrganizationId);
      }
    }, 300)


    this.route.params.subscribe(params => {
      if (params['id']) {
        // this.utils.showLoader();
        this.mode = 'edit';
        this.paramsId = params['id'];
      }
    });

    this.getAllOrganization();
    this.getAllLocation();




  }

  model: any = {}

  onSubmit(NgForm: any) {
    this.utils.showLoader();
    if (this.selectedOrganization) {
      var orgId = this.selectedOrganization.id
    } else if (this.orgIdFromLocalHost) {
      orgId = this.orgIdFromLocalHost
    }

    var selectedDaysObjs = [];
    if (this.selectedDays && this.selectedDays.length > 0) {
      selectedDaysObjs = this.selectedDays.map((x: any) => {
        return {
          Id: (x.id.toString())
        }
      })
    }

    const body = {

      Id: this.paramsId ? this.paramsId : "",
      ShiftId: this.selectedShift?.id ?? null,
      OrganizationId: orgId ? orgId : null,
      CompanyId: this.selectedCompany?.id ?? null,
      companyLocationId: this.selectedClientCompanyLocation?.id ?? null,
      organizationLocationId: this.selectedCompanyLocation?.id ?? null,
      UserId: this.currentUserId ? this.currentUserId : "",
      IsActive: true,
      Days: selectedDaysObjs && selectedDaysObjs.length ? selectedDaysObjs : []



    }


    this.offDayService.addEditOffDay(body).subscribe(res => {
      if (res && res.StatusCode == 200) {
        this.utils.notification(res.CommonMessage, 'success');
        this.router.navigate(['/main/attendance/off-day']);
        this.utils.hideLoader();

      }
    }, (error => {
      this.utils.hideLoader();

    }))
  }

  getAllDays() {
    this.offDayService.getAllDaysDrop().subscribe(res => {
      if (res && res.StatusCode == 200) {
        this.daysData = res.Result;
        this.daysArray = this.daysData.map((item: any) => ({
          id: item.Id,
          name: item.Name
        }));
      }
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

        if(this.paramsId){
          this.getById(this.paramsId);
        }else{
          this.utils.hideLoader();

        }


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

  getAllShift(id, status?) {

    if (this.orgIdFromLocalHost) {
      var orgId = this.orgIdFromLocalHost
    } else {
      var orgId = id
    }

    this.shiftAssignService.getAllShiftsDrop(orgId, this.selectedCompany?.id).subscribe(res => {
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

      this.utils.hideLoader();
    })
  }

  rowsData: any;
  getById(id: any) {
    const body = {
      id: id
    }
    this.offDayService.getOffDayById(body).subscribe(res => {
      if (res && res.StatusCode == 200) {
        this.rowsData = res.Result;

        if (this.rowsData.Days && this.rowsData.Days.length > 0) {
          this.selectedDays = this.daysArray.filter(day =>
            this.rowsData.Days.some(d => d.Id === day.id)
          );

        }

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
        this.utils.hideLoader();
      }else {
        this.utils.hideLoader();
      }
    }, (error) => {
      this.utils.hideLoader();
    })
  }


  onOrganizationChange(id: any, status?) {
    this.selectedCompany = null;
    this.selectedLocation = null;
    this.selectedClientCompanyLocation = null;
    this.clietnCompanyLocationArray = []
    this.selectedCompanyLocation = null;
    this.companylocationArray = [];
    this.selectedShift = null;
    this.shiftArray = [];



    this.companyService.getAllCompanysDrop(id).subscribe(res => {
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


    })


    if (id && !this.selectedOrganization) {
      this.getCompanyLocation(id, status);
      // this.getAllShift(id, status);
    }

    if (this.selectedOrganization) {
      this.getCompanyLocation(this.selectedOrganization.id, status);

    }

    if (!this.selectedOrganization) {
      this.showShift(status);
    }


  }


  onComnpanyChange(orgId: any, comId: any, status?) {

    this.selectedClientCompanyLocation = null;
    this.clietnCompanyLocationArray = []
    this.selectedShift = null;
    this.shiftArray = []




    if (this.currentUserRole === 'Admin') {

      orgId = this.orgIdFromLocalHost;
    }

    if (this.selectedCompany) {
      this.getClientCompanyLocation(status);
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

    this.locationService.getAllLocationsDrop(orgId, this.selectedCompany?.id, isOrganizationLocation).subscribe(res => {
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
    this.locationService.getAllLocationsDrop('', this.selectedCompany?.id, false).subscribe(res => {
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

  // getAllShiftsDropdownValue(status, orgId, orgLocId, comId?, comLocId?) {

  //   this.selectedShift = null;
  //   this.shiftArray = [];

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


  //   this.shiftAssignService.getAllShiftsDrop(cOrgId, comId, this.isActive, isOrganizationLocation, orgLocId, comLocId).subscribe(res => {
  //     if (res && res.StatusCode == 200) {
  //       this.shiftArray = [];

  //       this.shiftData = res.Result;

  //       var sArr = this.shiftData.map((item: any) => ({
  //         id: item.Id,
  //         name: item.Name
  //       }));


  //       this.shiftArray = JSON.parse(JSON.stringify(sArr));

  //     }

  //     if (this.shiftArray && status && this.mode == 'edit' && this.rowsData.ShiftId) {
  //       this.selectedShift = this.shiftArray.find(
  //         (x) => x.id === this.rowsData.ShiftId
  //       )

  //     }

  //     this.utils.hideLoader();
  //   })
  // }

  getAllShiftsDropdownValue(status, orgId, orgLocId, comId?, comLocId?) {
    this.selectedShift = null;
    this.shiftArray = []; // Clear array before making API call
  
    let isOrganizationLocation = !!(this.selectedCompany && !this.selectedOrganization);
  
    let cOrgId = this.orgIdFromLocalHost || this.selectedOrganization?.id;
  
    this.shiftAssignService.getAllShiftsDrop(cOrgId, comId, this.isActive, isOrganizationLocation, orgLocId, comLocId)
      .subscribe(res => {
        if (res?.StatusCode === 200) {
          this.shiftArray = res.Result.map((item: any) => ({
            id: item.Id,
            name: item.Name
          })); // Directly mapping response data
  
          // Ensuring selectedShift gets the updated value
          if (this.shiftArray.length && status && this.mode === 'edit' && this.rowsData?.ShiftId) {
            this.selectedShift = this.shiftArray.find(x => x.id === this.rowsData.ShiftId) || null;
          }
        } else {
          this.shiftArray = []; // Ensure it's empty if response is invalid
        }
  
        this.utils.hideLoader();
      }, error => {
        this.shiftArray = []; // Handle API errors by ensuring shiftArray remains clean
        this.utils.hideLoader();
      });
  }
  


  showShift(status: any) {

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



  onClear() {
    // Logic for clearing the form
    this.model = {};

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


  onSearch(searchText: any, itemValue: any, itemNameKey: string = 'name') {
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
}
