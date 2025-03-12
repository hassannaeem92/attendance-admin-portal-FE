import { Component, inject } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgSelectModule } from '@ng-select/ng-select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Utils } from '../../../../utils';
import { LocationService } from '../../../_services/location/location.service';
import { DesignationService } from '../../../_services/designation/designation.service';
import { OrganizationService } from '../../../_services/organization/organization.service';
import { OrganizationModalComponent } from "../../../../_sharedresources/modals/organization-modal/organization-modal.component";
import { CompanyModalComponent } from "../../../../_sharedresources/modals/company-modal/company-modal.component";
import { DevicesService } from '../../../_services/devices/devices.service';
import { CompanyService } from '../../../_services/companies/company.service';
import { LocationModalComponent } from "../../../../_sharedresources/modals/location-modal/location-modal.component";
import { OrganizationLocationModalComponent } from "../../../../_sharedresources/modals/organization-location-modal/organization-location-modal.component";
import { CompanyLocationModalComponent } from "../../../../_sharedresources/modals/company-location-modal/company-location-modal.component";
import { MatTabsModule } from '@angular/material/tabs';
import { environment } from '../../../../../environments/environment.development';
import { UserServiceService } from '../../../_services/user-service.service';
import Swal from 'sweetalert2';
declare const $: any


@Component({
  selector: 'app-add-edit-devices',
  standalone: true,
  imports: [FormsModule, NgFor, MatTabsModule, NgIf, RouterLink, NgClass, NgSelectModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, OrganizationModalComponent, CompanyModalComponent, LocationModalComponent, OrganizationLocationModalComponent, CompanyLocationModalComponent],

  templateUrl: './add-edit-devices.component.html',
  styleUrl: './add-edit-devices.component.scss'
})
export class AddEditDevicesComponent {
  readonly utils = inject(Utils);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly locationService = inject(LocationService);
  readonly organizationService = inject(OrganizationService);
  readonly designationService = inject(DesignationService);
  readonly deviceService = inject(DevicesService);
  readonly companyService = inject(CompanyService);
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

  selectedBrightnessLevel = 10; // Default value (can be changed)

  attendanceTypeArray: any = [
    { id: 1, name: 'Facial Recongnition' },
    { id: 2, name: 'Biometric' },
    { id: 3, name: 'SSN' },
    { id: 4, name: 'Last Name' },
  ];
  selectedAttendanceType: any;
  // New Variables 

  orientationArray = [
    { id: 2, name: 'Landscape' },
    { id: 2, name: 'Portrait' },
  ]

  // fontSizesArray: any;
  // themesArray: any;
  // fontFamiliesArray: any

  fontSizesArray = [
    { id: 2, name: 'Small', sizeValue: '40px' },
    { id: 2, name: 'Medium', sizeValue: '60px' },
    { id: 3, name: 'Large', sizeValue: '70px' },
    { id: 3, name: 'Extra Large', sizeValue: '80px' }
  ];

  fontSizesArrayAll = [
    { id: 1, name: 'Small', sizeValue: '20px' },
    { id: 2, name: 'Medium', sizeValue: '24px' },
    { id: 3, name: 'Large', sizeValue: '28px' },
    { id: 3, name: 'Extra Large', sizeValue: '32px' }
  ];

  fontFamiliesArray = [
    { id: 1, name: 'Arial, sans-serif' },
    { id: 2, name: 'Times New Roman, serif' },
    { id: 3, name: 'Courier New, monospace' }
  ];

  themesArray = [
    { id: 1, name: 'Light' },
    { id: 2, name: 'Dark' }
  ];

  colorOptions = [
    { id: 1, name: 'White' },
    { id: 2, name: 'Black' }
  ];

  // themeModel: any = {};

  editId: any;
  selectedTimeFontSize: any;
  selectedDateFontSize: any;
  selectedAddressFontSize: any;
  selectedDisplayFontSize: any;
  selectedDisplayTextFontSize: any;
  selectedOrientation: any
  logoPreview: string | ArrayBuffer | null = null;
  imageUrlEdit: any
  imageUrl: any;
  imageName: any;

  selectedFontSize: any;
  selectedFontFamily: any;
  selectedTheme: any;


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

  // onSubmit(type?: any) {

  //   if (this.model?.name == '' || this.model?.name == null || this.model?.name == undefined) {
  //     this.utils.notification('Name is required', 'error');
  //     return
  //   }

  //   if (!this.selectedCompanyLocation) {
  //     this.utils.notification('Location is required', 'error');
  //     return
  //   }

  //   if (this.selectedCompany && !this.selectedClientCompanyLocation) {
  //     this.utils.notification('Location is required', 'error');
  //     return
  //   }


  //   if (this.selectedOrganization) {
  //     var orgId = this.selectedOrganization.id
  //   } else if (this.orgIdFromLocalHost) {
  //     orgId = this.orgIdFromLocalHost
  //   }

  //   if (this.selectedClientCompanyLocation && this.selectedCompanyLocation) {
  //     var comImageValue = this.imageUrl || this.imageUrlEdit
  //     orgImageValue = null;
  //   }

  //   if (!this.selectedClientCompanyLocation && this.selectedCompanyLocation) {
  //     var orgImageValue = this.imageUrl || this.imageUrlEdit || ''
  //     comImageValue = null
  //   }


  //   const body = {
  //     // Id: this.paramsId? this.paramsId : "",
  //     // Name: this.model?.Name ? this.model.Name : null,
  //     // Description: this.model?.description ? this.model.description : null,
  //     // UserId: this.currentUserId ? this.currentUserId : "",
  //     // IsActive: true,
  //     //  OrganizationId: this.selectedOrganization?.id ?? null,
  //     // CompanyId: this.selectedCompany?.id ?? null,


  //     Id: this.paramsId ? this.paramsId : "",
  //     Name: this.model?.name || '',
  //     PublicIPAddress: this.model?.publicIPAddress || '',
  //     PrivateIPAddress: this.model?.privateIPAddress || '',
  //     Manufacturer: this.model?.manufacturer || '',
  //     MacAddress: this.model?.macAddress || '',
  //     Description: this.model?.description || '',
  //     IsActive: true,
  //     OrganizationId: orgId ? orgId : null,
  //     CompanyId: this.selectedCompany?.id ?? null,
  //     LocationId: this.selectedLocation?.id ?? null,
  //     UserId: this.currentUserId ? this.currentUserId : "",
  //     companyLocationId: this.selectedClientCompanyLocation?.id ?? null,
  //     organizationLocationId: this.selectedCompanyLocation?.id ?? null,


  //     // DateColor: this.themeModel.dateColor || '',
  //     // AddressColor: this.themeModel.addressColor || '',
  //     // DialpadTextColor: this.themeModel.dialpadTextColor || '',
  //     // DialpadColor: this.themeModel.dialpadColor || '',
  //     // BackgroundColor: this.themeModel.backgroundColor || '',
  //     // TimeColor: this.themeModel.timeColor || '',

  //     FontFamily: this.selectedFontFamily ? this.selectedFontFamily?.name : null,
  //     Theme: this.selectedTheme ? this.selectedTheme.name : null,
  //     TimeFontSize: this.selectedTimeFontSize ? this.selectedTimeFontSize.name : null,
  //     DateFontSize: this.selectedDateFontSize ? this.selectedDateFontSize.name : null,
  //     AddressFontSize: this.selectedAddressFontSize ? this.selectedAddressFontSize.name : null,
  //     DialpadTextFontSize: this.selectedDisplayTextFontSize ? this.selectedDisplayTextFontSize.name : null,
  //     DialpadFontSize: this.selectedDisplayFontSize ? this.selectedDisplayFontSize.name : null,
  //     OrganizationLogo: orgImageValue ? orgImageValue : '',
  //     CompanyLogo: comImageValue ? comImageValue : '',
  //     Orientation: this.selectedOrientation?.name || '',
  //     FontSize: '',

  //     ...this.colorFields.reduce((acc, field) => {
  //       const formattedField = field.key.charAt(0).toUpperCase() + field.key.slice(1);
  //       acc[formattedField] = this.themeModel[field.key] || '';
  //       return acc;
  //     }, {}),
      

  //   }


  //   this.deviceService.addEditDevice(body).subscribe(res => {
  //     if (res && res.StatusCode == 200) {
  //       this.utils.notification(res.CommonMessage, 'success');
  //       this.router.navigate(['/main/attendance/device']);

  //     }
  //   })
  // }


 

onSubmit(type?: any) {
  if (this.model?.name == '' || this.model?.name == null || this.model?.name == undefined) {
    this.utils.notification('Name is required', 'error');
    window.scrollTo({ top: 0, behavior: 'smooth' })
    this.utils.hideLoader();
    return;
  }

  if (!this.selectedCompanyLocation) {
    this.utils.notification('Location is required', 'error');
    window.scrollTo({ top: 0, behavior: 'smooth' })
    this.utils.hideLoader();
    return;
  }

  if (this.selectedCompany && !this.selectedClientCompanyLocation) {
    this.utils.notification('Location is required', 'error');
    window.scrollTo({ top: 0, behavior: 'smooth' })
    this.utils.hideLoader();
    return;
  }

//   if ([this.model.isFacial, this.model.isBiometric, this.model.isSSN, this.model.isLastName].every(value => !value)) {
//     window.scrollTo({ top: 0, behavior: 'smooth' })
//     this.utils.notification('Select Attendance Type', 'error');
//     this.utils.hideLoader();
//     return;
// }

  if(!this.selectedAttendanceType){
    window.scrollTo({ top: 0, behavior: 'smooth' })
      this.utils.notification('Select Attendance Type', 'error');
      this.utils.hideLoader();
      return;
  }

  let orgId = this.selectedOrganization?.id || this.orgIdFromLocalHost;

  let comImageValue = null;
  let orgImageValue = null;

  if (this.selectedClientCompanyLocation && this.selectedCompanyLocation) {
    comImageValue = this.imageUrl || this.imageUrlEdit;
  } else if (!this.selectedClientCompanyLocation && this.selectedCompanyLocation) {
    orgImageValue = this.imageUrl || this.imageUrlEdit || '';
  }

  const body = {
    Id: this.paramsId || '',
    Name: this.model?.name || '',
    PublicIPAddress: this.model?.publicIPAddress || '',
    PrivateIPAddress: this.model?.privateIPAddress || '',
    Manufacturer: this.model?.manufacturer || '',
    MacAddress: this.model?.macAddress || '',
    Description: this.model?.description || '',
    IsActive: true,
    OrganizationId: orgId || null,
    CompanyId: this.selectedCompany?.id ?? null,
    LocationId: this.selectedLocation?.id ?? null,
    UserId: this.currentUserId || '',
    companyLocationId: this.selectedClientCompanyLocation?.id ?? null,
    organizationLocationId: this.selectedCompanyLocation?.id ?? null,
    FontFamily: this.selectedFontFamily?.name || null,
    Theme: this.selectedTheme?.name || null,
    TimeFontSize: this.selectedTimeFontSize?.name || null,
    DateFontSize: this.selectedDateFontSize?.name || null,
    AddressFontSize: this.selectedAddressFontSize?.name || null,
    DialpadTextFontSize: this.selectedDisplayTextFontSize?.name || null,
    DialpadFontSize: this.selectedDisplayFontSize?.name || null,
    OrganizationLogo: orgImageValue || '',
    CompanyLogo: comImageValue || '',
    Orientation: this.selectedOrientation?.name || '',
    FontSize: '',
    ...this.colorFields.reduce((acc, field) => {
      const formattedField = field.key.charAt(0).toUpperCase() + field.key.slice(1);
      acc[formattedField] = this.themeModel[field.key] || '';
      return acc;
    }, {}),

    Brightness: (this.selectedBrightnessLevel/100).toString() || '0.1',
    // IsFacial: this.model.isFacial || false,
    // IsBiometric: this.model.isBiometric || false,
    // IsSSN	: this.model.isSSN || false,
    // IsLastName: this.model.isLastName || false

    IsFacial: this.selectedAttendanceType.name === "Facial",
    IsBiometric: this.selectedAttendanceType.name === "Biometric",
    IsSSN: this.selectedAttendanceType.name === "SSN",
    IsLastName: this.selectedAttendanceType.name === "Last Name"

  };

  // **Show Swal confirmation if type is 'themeForm' or 'fontForm'**
  if (type === 'themeForm' || type === 'fontForm') {
    Swal.fire({
      title: '<h5>Updating will override global device settings</h5>',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Proceed',
      cancelButtonText: 'No',
      
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with API call
        this.submitDeviceData(body);
      }
    });
  } else {
    // Normal submission without Swal
    this.submitDeviceData(body);
  }
}

submitDeviceData(body: any) {
  this.deviceService.addEditDevice(body).subscribe((res) => {
    if (res && res.StatusCode == 200) {
      this.utils.notification(res.CommonMessage, 'success');
      this.router.navigate(['/main/attendance/device']);
    }
  });
}








  getAllOrganization() {

    this.organizationService.getAllOrganizationDrop().subscribe(res => {
      if (res && res.StatusCode == 200) {

        this.organizationData = res.Result;

        this.organizationArray = this.organizationData.map((item: any) => ({
          id: item.Id,
          name: item.Name
        }));

        setTimeout(() => {
          if (this.paramsId) {
            this.getById(this.paramsId);
          } else {
            this.utils.hideLoader();

          }

        })

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
    this.deviceService.getDeviceById(body).subscribe(res => {
      if (res && res.StatusCode == 200) {
        this.rowsData = res.Result;
        this.selectedBrightnessLevel = this.rowsData.Brightness ? Number(this.rowsData.Brightness) * 100 : 10

        this.model = {
          name: this.rowsData.Name || '',
          publicIPAddress: this.rowsData.PublicIPAddress || '',
          privateIPAddress: this.rowsData.PrivateIPAddress || '',
          manufacturer: this.rowsData.Manufacturer || '',
          macAddress: this.rowsData.MacAddress || '',
          description: this.rowsData.Description || '',

          // isFacial: this.rowsData.IsFacial || false,
          // isBiometric: this.rowsData.IsBiometric || false,
          // isSSN: this.rowsData.IsSSN || false,
          // isLastName: this.rowsData.IsLastName || false

        };

        this.selectedAttendanceType = this.attendanceTypeArray.find(type => 
          (type.name === "Facial Recongnition" && this.rowsData.IsFacial) ||
          (type.name === "Biometric" && this.rowsData.IsBiometric) ||
          (type.name === "SSN" && this.rowsData.IsSSN) ||
          (type.name === "Last Name" && this.rowsData.IsLastName)
        ) || null;
        // Map dropdown values

        this.selectedOrganization = this.organizationArray.find(
          (x) => x.id === this.rowsData.OrganizationId
        );


        if (res.Result.TimeFontSize) {
          this.selectedTimeFontSize = this.fontSizesArray.find((x: any) => x.name == res.Result.TimeFontSize);
        }

        if (res.Result.DateFontSize) {
          this.selectedDateFontSize = this.fontSizesArrayAll.find((x: any) => x.name == res.Result.DateFontSize);
        }

        if (res.Result.AddressFontSize) {
          this.selectedAddressFontSize = this.fontSizesArrayAll.find((x: any) => x.name == res.Result.AddressFontSize);
        }

        if (res.Result.DialpadTextFontSize) {
          this.selectedDisplayTextFontSize = this.fontSizesArrayAll.find((x: any) => x.name == res.Result.DialpadTextFontSize);
        }

        if (res.Result.DialpadFontSize) {
          this.selectedDisplayFontSize = this.fontSizesArrayAll.find((x: any) => x.name == res.Result.DialpadFontSize);
        }

        if (res.Result.FontFamily) {
          this.selectedFontFamily = this.fontFamiliesArray.find((x: any) => x.name == res.Result.FontFamily);
        }

        if (res.Result.Theme) {
          this.selectedTheme = this.themesArray.find((x: any) => x.name == res.Result.Theme);
        }

        if (res.Result.Orientation) {
          this.selectedOrientation = this.orientationArray.find((x: any) => x.name == res.Result.Orientation);
        }


        this.themeModel.dateColor = res.Result.DateColor || ''
        // this.displayDateColor = res.Result.DateColor || ''

        // this.themeModel.addressColor = res.Result.AddressColor || ''
        // this.themeModel.dialpadTextColor = res.Result.DialpadTextColor || ''
        // this.themeModel.dialpadColor = res.Result.DialpadColor || ''
        // this.themeModel.backgroundColor = res.Result.BackgroundColor || ''
        // this.themeModel.timeColor = res.Result.TimeColor || ''

        // this.colorFields.forEach((field) => {
        //   const formattedField = field.charAt(0).toUpperCase() + field.slice(1); // Convert to match API keys
        //   this.themeModel[field] = res.Result[formattedField] || ''; // Assign values dynamically
        // });


        this.colorFields.forEach((field) => {
          const formattedField = field.key.charAt(0).toUpperCase() + field.key.slice(1); // Match API keys
          this.themeModel[field.key] = res.Result[formattedField] || ''; // Assign values dynamically
          this.displayColors[field.key] = res.Result[formattedField] || ''; // Ensure text input updates
        });
        
        

     



        if (res.Result.OrganizationLogo) {
          this.logoPreview = environment.userModuleApiImageBaseUrl + res.Result.OrganizationLogo
          this.imageUrlEdit = res.Result.OrganizationLogo
        }

        if (res.Result.CompanyLogo) {
          this.logoPreview = environment.userModuleApiImageBaseUrl + res.Result.CompanyLogo
          this.imageUrlEdit = res.Result.CompanyLogo
        }

        // this.selectedCompany = this.companyArray.find(
        //   (x) => x.id === rowsData.CompanyId
        // );

        // this.selectedLocation = this.locationArray.find(
        //   (x) => x.id === this.rowsData.LocationId
        // );


        this.onOrganizationChange(this.selectedOrganization?.id);



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
          (x) => x.id === this.rowsData?.CompanyId
        );
        this.onComnpanyChange(this.selectedOrganization?.id, this.selectedCompany?.id);
      }


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

    this.utils.hideLoader();


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


      if (this.companylocationArray && this.mode == 'edit' && this.rowsData?.OrganizationLocationId) {
        this.selectedCompanyLocation = this.companylocationArray.find(
          (x) => x.id === this.rowsData?.OrganizationLocationId
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
  isOrgAdded(event: any) {
    if (true) {
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


  isComAdded(event: any) {
    if (true) {
      this.selectedCompany = null;
      this.selectedOrganization = null;

      if (this.selectedOrganization) {
        var orgId = this.selectedOrganization.id
      } else if (this.orgIdFromLocalHost) {
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

  isComLocAdded(event: any, status?) {
    if (true) {
      this.selectedClientCompanyLocation = null;
      this.clietnCompanyLocationArray = [];
      this.selectedCompanyLocation = null;
      this.companylocationArray = [];
      this.selectedOrganization = null;
      this.selectedCompany = null;

    }

    if (status == 'org' && this.currentUserRole === 'Admin') {

      var isOrganizationLocation: boolean = true
      if (this.orgIdFromLocalHost) {
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

  onLogoUpload(event: any) {
    this.utils.showLoader()
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();

      // Append the file to the FormData object with a specific field name
      formData.append('file', file, file.name);

      // Call the userService method to upload the file
      this.userService.uploadImage(formData).subscribe({
        next: (response) => {
          if (response) {
            this.utils.notification('Image Uploaded Successfully', 'success');
            this.imageUrl = response.FilePath;
            this.imageName = response.OrgionalFileName;
            this.logoPreview = environment.userModuleApiImageBaseUrl + this.imageUrl
            this.utils.hideLoader()

          }
        },
        error: (error) => {
          this.utils.notification('Image Failed to Upload', 'error');
          this.utils.hideLoader()

        }
      });
    } else {
      this.utils.notification('No file selected', 'warning');
    }
  }
  // convertColorToHex(): void {
  //   const tempElement = document.createElement("div");
  //   tempElement.style.color = this.themeModel.dateColor;

  //   document.body.appendChild(tempElement);

  //   const computedColor = window.getComputedStyle(tempElement).color;
  //   document.body.removeChild(tempElement);

  //   this.themeModel.dateColor = this.rgbToHex(computedColor);
  // }

  //     rgbToHex(rgb: string): string {
  //       const match = rgb.match(/\d+/g);
  //       if (!match || match.length < 3) return '#000000'; // Default to black if invalid

  //       const r = parseInt(match[0]).toString(16).padStart(2, '0');
  //       const g = parseInt(match[1]).toString(16).padStart(2, '0');
  //       const b = parseInt(match[2]).toString(16).padStart(2, '0');

  //       return `#${r}${g}${b}`.toUpperCase();
  //     } 




  // convertColorToHex(property: string): void {
  //   const tempElement = document.createElement("div");
  //   tempElement.style.color = this.themeModel[property];

  //   document.body.appendChild(tempElement);
  //   const computedColor = window.getComputedStyle(tempElement).color;
  //   document.body.removeChild(tempElement);

  //   this.themeModel[property] = this.rgbToHex(computedColor);
  // }

  // rgbToHex(rgb: string): string {
  //   const match = rgb.match(/\d+/g);
  //   if (!match || match.length < 3) return '#000000'; // Default to black if invalid

  //   const r = parseInt(match[0]).toString(16).padStart(2, '0');
  //   const g = parseInt(match[1]).toString(16).padStart(2, '0');
  //   const b = parseInt(match[2]).toString(16).padStart(2, '0');

  //   return `#${r}${g}${b}`.toUpperCase();
  // }

    // isValidColor(color: string): boolean {
  //   const tempElement = document.createElement("div");
  //   tempElement.style.color = color;
  //   document.body.appendChild(tempElement);
  //   const computedColor = window.getComputedStyle(tempElement).color;
  //   document.body.removeChild(tempElement);
    
  //   return computedColor !== 'rgba(0, 0, 0, 0)'; // If it's transparent, it's invalid
  // }
// New Working Code 
colorFields = [
  { key: 'dateColor', label: 'Date Color' },
  { key: 'addressColor', label: 'Address Color' },
  { key: 'dialpadTextColor', label: 'Dialpad Text Color' },
  { key: 'dialpadColor', label: 'Dial Pad Color' },
  { key: 'backgroundColor', label: 'Background Color' },
  { key: 'timeColor', label: 'Time Color' }
];


    themeModel: any = {
      dateColor: "",
      addressColor: "",
      dialpadTextColor: "",
      dialpadColor: "",
      backgroundColor: "",
      timeColor: "",
    };

    displayColors: any = {
      dateColor: "",
      addressColor: "",
      dialpadTextColor: "",
      dialpadColor: "",
      backgroundColor: "",
      timeColor: "",
    };

    validateAndConvertColor(field: string): void {
      if (this.isValidColor(this.displayColors[field])) {
        const hexColor = this.convertColorToHex(this.displayColors[field]);
        this.themeModel[field] = hexColor; // Store the hex value
      } else {
        this.displayColors[field] = ''; // Clear if invalid
        this.themeModel[field] = ''; // Store the hex value
        this.utils.notification('Invalid color', 'error');
      }
    }

    updateDisplayColor(field: string): void {
      this.displayColors[field] = this.themeModel[field].toUpperCase(); // Ensure uppercase HEX
    }

    isValidColor(color: string): boolean {
      if (!CSS.supports('color', color)) return false; // Quick check for valid color
      
      const tempElement = document.createElement("div");
      tempElement.style.color = color;
      document.body.appendChild(tempElement);

      const computedColor = window.getComputedStyle(tempElement).color;
      document.body.removeChild(tempElement);

      const invalidColors = ['rgba(0, 0, 0, 0)', 'rgba(37, 43, 54, 0.95)'];

      return !invalidColors.includes(computedColor);
    }

    convertColorToHex(color: string): string {
      const tempElement = document.createElement("div");
      tempElement.style.color = color;
      document.body.appendChild(tempElement);
      const computedColor = window.getComputedStyle(tempElement).color;
      document.body.removeChild(tempElement);

      return this.rgbToHex(computedColor);
    }

    rgbToHex(rgb: string): string {
      const match = rgb.match(/\d+/g);
      if (!match || match.length < 3) return '#000000'; // Default to black if invalid

      const r = parseInt(match[0]).toString(16).padStart(2, '0');
      const g = parseInt(match[1]).toString(16).padStart(2, '0');
      const b = parseInt(match[2]).toString(16).padStart(2, '0');

      return `#${r}${g}${b}`.toUpperCase();
    }




//   displayDateColor: string = '';
//   validateAndConvertColor(): void {
//     debugger
//     if (this.isValidColor(this.displayDateColor)) {
//       const hexColor = this.convertColorToHex(this.displayDateColor);
//       this.themeModel.dateColor = hexColor; // Store the hex value
//     } else {
//       this.displayDateColor = ''; // Clear the field if invalid
//     }
//   }
  

//   isValidColor(color: string): boolean {
//     if (!CSS.supports('color', color)) return false; // Quick check for valid color
    
//     const tempElement = document.createElement("div");
//     tempElement.style.color = color;
//     document.body.appendChild(tempElement);

//     const computedColor = window.getComputedStyle(tempElement).color;
//     document.body.removeChild(tempElement);

//     // Check for default and fallback colors
//     const invalidColors = ['rgba(0, 0, 0, 0)', 'rgba(37, 43, 54, 0.95)'];

//     return !invalidColors.includes(computedColor);
// }


//   convertColorToHex(color: string): string {
//     const tempElement = document.createElement("div");
//     tempElement.style.color = color;
//     document.body.appendChild(tempElement);
//     const computedColor = window.getComputedStyle(tempElement).color;
//     document.body.removeChild(tempElement);
  
//     return this.rgbToHex(computedColor);
//   }
  
//   rgbToHex(rgb: string): string {
//     const match = rgb.match(/\d+/g);
//     if (!match || match.length < 3) return '#000000'; // Default to black if invalid
  
//     const r = parseInt(match[0]).toString(16).padStart(2, '0');
//     const g = parseInt(match[1]).toString(16).padStart(2, '0');
//     const b = parseInt(match[2]).toString(16).padStart(2, '0');
  
//     return `#${r}${g}${b}`.toUpperCase();
//   }

//   updateDisplayColor(): void {
//     this.displayDateColor = this.themeModel.dateColor.toUpperCase(); // Ensure uppercase HEX
//   }
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

  onClear() {
    // Logic for clearing the form
    this.model = {};
    this.themeModel = {};
    this.selectedOrganization = null;
    this.selectedCompany = null;
    this.selectedClientCompanyLocation = null;
    this.selectedCompanyLocation = null;


  }
  selectedTabIndex: any = 0;
  onTabChange(event: any) {
    this.selectedTabIndex = event.index;
  }

  createOrganization() {
    $('#organization-modal').modal('show');
  }


  createCompany() {
    $('#company-modal').modal('show');
  }

  createCompanyLocation() {
    $('#company-location-modal').modal('show');
  }
  createOrgLocation() {
    $('#organization-location-modal').modal('show');

  }

}
