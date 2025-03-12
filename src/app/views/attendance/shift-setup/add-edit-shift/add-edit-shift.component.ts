import { Component, inject } from '@angular/core';
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
import { Utils } from '../../../../utils';
import { LocationService } from '../../../_services/location/location.service';
import { OrganizationService } from '../../../_services/organization/organization.service';
import { DesignationService } from '../../../_services/designation/designation.service';
import { DevicesService } from '../../../_services/devices/devices.service';
import { CompanyService } from '../../../_services/companies/company.service';
import { DateService } from '../../../../_sharedresources/date-service/date.service';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { ShiftService } from '../../../_services/shift/shift.service';
import { CompanyLocationModalComponent } from "../../../../_sharedresources/modals/company-location-modal/company-location-modal.component";
import { OrganizationLocationModalComponent } from "../../../../_sharedresources/modals/organization-location-modal/organization-location-modal.component";
declare const $: any;

@Component({
  selector: 'app-add-edit-shift',
  standalone: true,
  imports: [FormsModule, NgxMatTimepickerModule, NgIf, RouterLink, NgClass, NgSelectModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, OrganizationModalComponent, CompanyModalComponent, LocationModalComponent, CompanyLocationModalComponent, OrganizationLocationModalComponent],

  templateUrl: './add-edit-shift.component.html',
  styleUrl: './add-edit-shift.component.scss'
})
export class AddEditShiftComponent {
  readonly utils = inject(Utils);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly locationService = inject(LocationService);
  readonly organizationService = inject(OrganizationService);
  readonly designationService = inject(DesignationService);
  readonly deviceService = inject(DevicesService);
  readonly companyService = inject(CompanyService);
  readonly dateService = inject(DateService);
  readonly shiftService = inject(ShiftService);


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
  startTime: any
  endTime: any;

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

  selectedSalaryType: any;
  salaryTypeArray: any = [
    { id: 1, name: 'Weekly' },
    { id: 2, name: 'Bi-Weekly' },
    { id: 3, name: 'Monthly' },

  ];


  breakTypeArray: any = [
    { id: 1, name: 'Paid' },
    { id: 2, name: 'Un-Paid' },
  ]

  selectedbreakType: any;

  cutOffDate: any;
  cutOffDateValue: any;


  ngOnInit(): void {

    this.utils.showLoader();
    const userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null;
    this.currentUserId = userData.Id


    this.currentUserRole = userData.Role
    this.orgIdFromLocalHost = userData.OrganizationId


    setTimeout(() => {
      if (this.currentUserRole === 'Admin' && userData.OrganizationId) {
        this.onOrganizationChange(userData.OrganizationId);
      }
    }, 500)


    // this.getAllCountry();
    // this.getAllCompany();
    this.getAllOrganization();
    this.getAllLocation();

    this.route.params.subscribe(params => {
      if (params['id']) {
        // this.utils.showLoader();
        this.mode = 'edit';
        this.paramsId = params['id'];
      }
    });

  }

  model: any = {}

  onSubmit(NgForm: any) {

    if (this.selectedOrganization) {
      var orgId = this.selectedOrganization.id
    } else if (this.orgIdFromLocalHost) {
      orgId = this.orgIdFromLocalHost
    }


    const body = {

      Id: this.paramsId ? this.paramsId : "",
      Name: this.model?.name || '',
      IsActive: true,
      Description: this.model?.description || '',
      UserId: this.currentUserId ? this.currentUserId : "",
      OrganizationId: orgId ? orgId : null,
      CompanyId: this.selectedCompany?.id ?? null,
      companyLocationId: this.selectedClientCompanyLocation?.id ?? null,
      organizationLocationId: this.selectedCompanyLocation?.id ?? null,
      CutOfDate: this.cutOffDateValue ? this.cutOffDateValue : null,
      SalaryType: this.selectedSalaryType ? this.selectedSalaryType.name : null,
      StartTime: this.startTime ? this.dateService.timeToISO(this.startTime) : null,
      EndTime: this.endTime ? this.dateService.timeToISO(this.endTime) : null,
      Duration: this.model.duration ? this.model.duration : null,
      TimeRelaxation: (this.model.gracePeriod).toString() || null,
      BreakType: this.selectedbreakType ? this.selectedbreakType.name : null,
      CutOff: this.model.cutOff || null

    }


    this.shiftService.addEditShift(body).subscribe(res => {
      if (res && res.StatusCode == 200) {
        this.utils.notification(res.CommonMessage, 'success');
        this.router.navigate(['/main/attendance/shift']);

      }
    })
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

      }else{
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
  rowsData: any;
  getById(id: any) {
    const body = {
      id: id
    }
    this.shiftService.getShiftById(body).subscribe(res => {
      if (res && res.StatusCode == 200) {
        this.rowsData = res.Result;

        if (this.rowsData.CutOfDate) {
          this.cutOffDate = new Date(this.rowsData.CutOfDate);
          this.cutOffDateValue = this.dateService.formatDate(this.cutOffDate, 'yyyy-MM-dd');
        }


        if(this.rowsData.BreakType){
          this.selectedbreakType = this.breakTypeArray.find((x) => x.name === this.rowsData.BreakType);
        }

        this.model.cutOff = this.rowsData.CutOff
        
        this.model.gracePeriod = Number(this.rowsData.TimeRelaxation);



        if (this.rowsData.StartTime) {
          this.startTime = this.dateService.paeseTime(this.rowsData.StartTime);
        }

        if (this.rowsData.EndTime) {
          this.endTime = this.dateService.paeseTime(this.rowsData.EndTime);
        }

        if(this.rowsData.SalaryType){
          this.selectedSalaryType = this.salaryTypeArray.find((x) => x.name === this.rowsData.SalaryType);
        }

          this.model.name = this.rowsData.Name || '',
          this.model.description = this.rowsData.Description || '',
          this.model.duration = this.rowsData.Duration ? this.rowsData.Duration : ''

      

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


        this.onOrganizationChange(this.selectedOrganization?.id);



      }else{
        this.utils.hideLoader();
      }
    }, (error) => {
      this.utils.hideLoader();
    })
  }


  onOrganizationChange(id: any) {
    this.selectedCompany = null;
    this.selectedLocation = null;
    this.selectedClientCompanyLocation = null;
    this.clietnCompanyLocationArray = []
    this.selectedCompanyLocation = null;
    this.companylocationArray = [];


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
        this.onComnpanyChange(this.selectedOrganization?.id, this.selectedCompany?.id);
      }
      this.utils.hideLoader();


    }, (error) => {
    this.utils.hideLoader();

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
    }


    if (this.selectedCompany) {
      this.getClientCompanyLocation();
    }

  }


  onComnpanyChange(orgId: any, comId: any) {

    this.selectedClientCompanyLocation = null;
    this.clietnCompanyLocationArray = []

    if (this.currentUserRole === 'Admin') {

      orgId = this.orgIdFromLocalHost;
    }

    if (this.selectedCompany) {
      this.getClientCompanyLocation();
    }

    // this.locationService.getAllLocationsDrop(orgId, comId).subscribe(res => {
    //   if (res && res.StatusCode == 200) {
    //     this.locationData = res.Result;
    //     var filteredRows = this.locationData.filter(row => row.IsActive);
    //     this.locationArray = filteredRows.map((item: any) => ({
    //       id: item.Id,
    //       name: item.Name
    //     }));
    //   }

    //   if(this.mode == 'edit'){
    //     this.selectedLocation = this.locationArray.find(
    //       (x) => x.id === this.rowsData.LocationId
    //     );
    //   }

    // })
  }

  getCompanyLocation(id) {

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
      }

    })
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

      if (this.clietnCompanyLocationArray && this.mode == 'edit' && this.rowsData.CompanyLocationId) {
        this.selectedClientCompanyLocation = this.clietnCompanyLocationArray.find(
          (x) => x.id === this.rowsData.CompanyLocationId
        )
      }

    })
  }

  onDateChange(event) {
    this.cutOffDateValue = this.dateService.formatDate(event.target.value, 'yyyy-MM-dd');
  }


  onClear() {
    // Logic for clearing the form
    this.model = {};
    this.selectedClientCompanyLocation = null;
    this.selectedCompanyLocation = null;
    this.selectedOrganization = null;
    this.selectedCompany  = null;

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
