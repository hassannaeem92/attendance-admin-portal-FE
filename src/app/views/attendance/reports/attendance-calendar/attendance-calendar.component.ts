import { Component, inject, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { NgClass, NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CompanyService } from '../../../_services/companies/company.service';
import { OrganizationService } from '../../../_services/organization/organization.service';
import { Utils } from '../../../../utils';
import { LocationService } from '../../../_services/location/location.service';
import { UserServiceService } from '../../../_services/user-service.service';
import { DevicesService } from '../../../_services/devices/devices.service';

export interface AttendanceEntry {
  Date: string;
  Status: string;
  ClockInTime?: string;  // Optional for Day Off/Holiday
  ClockOutTime?: string; // Optional for Day Off/Holiday
}

@Component({
  selector: 'app-attendance-calendar',
  standalone: true,
  imports: [FullCalendarModule,
    NgIf,
    MatInputModule,
    MatIconModule,
    NgClass,
    FormsModule,
    NgSelectModule,
  ],
  templateUrl: './attendance-calendar.component.html',
  styleUrl: './attendance-calendar.component.scss'
})

export class AttendanceCalendarComponent  implements OnInit {

  readonly companyService = inject(CompanyService);
  readonly organizationService = inject(OrganizationService);
  readonly utils = inject(Utils);
  readonly locationService = inject(LocationService);
  readonly userService = inject(UserServiceService);
  readonly deviceService = inject(DevicesService);


  userArray: any = [];
  selectedUser: any;
  userData: any
  locationData: any;

  isActive: any;

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

  isFirstLoaded: boolean = true;
  attendanceData: AttendanceEntry[] = [];

  // Dummy attendance data for a user
  // attendanceData: AttendanceEntry[] = [
  //   { date: '2024-11-01', status: 'Present', ClockInTime: '09:00 AM', ClockOutTime: '06:00 PM' },
  //   { date: '2024-11-02', status: 'Day Off', ClockInTime: '', ClockOutTime: '' },
  //   { date: '2024-11-03', status: 'Holiday', ClockInTime: '', ClockOutTime: '' },
  //   { date: '2024-11-04', status: 'Present', ClockInTime: '08:45 AM', ClockOutTime: '05:45 PM' },
  //   { date: '2024-11-05', status: 'Present', ClockInTime: '09:15 AM', ClockOutTime: '06:10 PM' },
  //   { date: '2024-11-06', status: 'Day Off', ClockInTime: '', ClockOutTime: '' },
  //   { date: '2024-11-07', status: 'Present', ClockInTime: '09:30 AM', ClockOutTime: '06:30 PM' },
  //   { date: '2024-11-08', status: 'Holiday', ClockInTime: '', ClockOutTime: '' },
  //   { date: '2024-11-09', status: 'Present', ClockInTime: '09:00 AM', ClockOutTime: '06:00 PM' },
  //   { date: '2024-11-10', status: 'Present', ClockInTime: '08:50 AM', ClockOutTime: '06:10 PM' },
  //   { date: '2024-11-11', status: 'Day Off', ClockInTime: '', ClockOutTime: '' },
  //   { date: '2024-11-12', status: 'Present', ClockInTime: '09:05 AM', ClockOutTime: '06:20 PM' }
  // ];


  currentUserId: any;
  currentUserRole: any;
  orgIdFromLocalHost: any;
  selectedMonth: any;
  selectedYear: any;

  

  ngOnInit() {


    const userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null;
    this.currentUserId = userData.Id
    this.currentUserRole = userData.Role;
    this.orgIdFromLocalHost = userData.OrganizationId

    this.selectedMonth  = new Date().getMonth() + 1; // Default to current month
    this.selectedYear  = new Date().getFullYear();


    this.getAllOrganization();
    // this.getAllLocation();
    this.getCompanyLocation();
    if (this.currentUserRole == 'Admin') {
      this.onOrganizationChange(this.orgIdFromLocalHost);
    }

  }



  showData(month?, year?){

    this.utils.showLoader()

    if (!this.selectedUser) {
      this.utils.hideLoader()
      this.utils.notification('Please select sser', 'error')
      return
    }

    if (this.selectedUser) {
      // var selectedUserObjs = this.selectedUser.map((x: any) => {
      //   return {
      //     UserId: (x.id.toString())
      //   }
      // })

      var selectedUserObjs = [{UserId: this.selectedUser?.id}]
    }
    
    if (this.selectedOrganization) {
      var orgId = this.selectedOrganization.id
    } else if (this.orgIdFromLocalHost) {
      orgId = this.orgIdFromLocalHost
    }

    const body = {
      selectedUserObjs: selectedUserObjs && selectedUserObjs.length ? selectedUserObjs : null,
      year: this.selectedYear,
      month: this.selectedMonth,
      locationId: this.selectedClientCompanyLocation?.id || this.selectedCompanyLocation?.id || null,
    }

    this.deviceService.getAttendanceCalendarData(body).subscribe((pagedData) => {
      if (pagedData && pagedData.Result && pagedData.Result.length) {
        this.attendanceData = pagedData.Result
        this.calendarOptions.events = this.getCalendarEvents();
        this.utils.hideLoader()
  
      } else {
        this.utils.notification('Data not found', 'error')
        this.utils.hideLoader();
      }


    }, (error) => {
      this.utils.hideLoader();
    });
  }




  getCalendarEvents() {
      return this.attendanceData.map(entry => ({
        title: `${entry.Status} (${entry.ClockInTime || 'N/A'} - ${entry.ClockOutTime || 'N/A'})`,
        start: entry.Date,
        color: this.getEventColor(entry.Status),
        extendedProps: {
          status: entry.Status,
          ClockInTime: entry.ClockInTime,
          ClockOutTime: entry.ClockOutTime,
        }
      }));

    
  }

  // Function to set event colors based on attendance status
  getEventColor(status: string): string {
    
    switch (status) {
      case 'Present': return '#1890ff';  // Blue
      case 'Absent': return '#ff0000';  // red
      case 'Off Day': return '#4d4d4d  '; // Red
      case 'Holiday': return '#ffc107'; // Yellow
      default: return '#6c757d';      
    }
  }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth', // Only Month View
    plugins: [dayGridPlugin, interactionPlugin], // Removed Week and Day Views
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: '' // Removed Week and Day View Buttons
    },
    selectable: true,
    editable: false,
    events: this.getCalendarEvents(),
    eventClick: (info: any) => {
      const ClockInTime = info.event.extendedProps?.ClockInTime || 'N/A';
      const ClockOutTime = info.event.extendedProps?.ClockOutTime || 'N/A';
      alert(`Attendance Status: ${info.event.title}\nIn Time: ${ClockInTime}\nOut Time: ${ClockOutTime}`);
    },
    datesSet: (info) => {
      if(this.isFirstLoaded){
        this.isFirstLoaded = false
      }else {
        this.onMonthChange(info.view.currentStart);
      }
    },
    eventDidMount: (info) => {
      if (info.event.extendedProps?.['status'] === 'Off Day') {
        // Find the parent day cell of the event
        const dayCell = document.querySelector(`[data-date="${info.event.startStr}"]`);
        if (dayCell) {
          const frameDiv = dayCell.querySelector('.fc-daygrid-day-frame');
          if (frameDiv) {
            frameDiv.classList.add('data-off-day'); // Add the class
          }
        }
      }
    }
  };


  onMonthChange(startDate: Date) {
    
    let month = startDate.getMonth(); // Zero-based month (0 = Jan, 1 = Feb, etc.)
    let year = startDate.getFullYear();
    
    // If we are moving backwards (like from Feb to Jan), adjust the logic
    if (month === 0) {
      // If it's January (month 0), set December (12) of the previous year
      this.selectedMonth = 1; 
      this.selectedYear = year; 
    } else if (month === 11) {
      // If it's December, it should be 12
      this.selectedMonth = 12;
      this.selectedYear = year;
    } else {
      // Otherwise, just increment month as it is already correctly zero-indexed
      this.selectedMonth = month + 1; // Now 1 = January, 2 = February, etc.
      this.selectedYear = year;
    }
    // Send API request with the new month and year
    this.showData(this.selectedMonth, this.selectedYear);
  }

  onOrganizationChange(id?: any) {
    this.selectedCompany = null;
    this.selectedClientCompanyLocation = null;
    this.clietnCompanyLocationArray = []
    this.selectedCompanyLocation = null;
    this.companylocationArray = [];
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


    })



    if (id && !this.selectedCompany) {
      this.getCompanyLocation(id);
      // this.getAllDevice(id);
    }


    if (this.selectedCompany) {
      this.getClientCompanyLocation();
    }

    if (!this.selectedOrganization) {
      this.showUsers();
    }


  }

  onComnpanyChange(orgId: any, comId: any) {

    this.selectedClientCompanyLocation = null;
    this.clietnCompanyLocationArray = []

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
      this.showUsers();
    }

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


    })
  }

  onCompanyLocationChange(comLocationId: any) {
    var isOrganizationLocation: boolean = true
    if (this.orgIdFromLocalHost) {
      var orgId = this.orgIdFromLocalHost
    } else {
      var orgId = this.selectedOrganization?.id
    }

    this.showUsers();


  }

  onClientCompanyLocationChange(clientComLocationId: any) {
    var isOrganizationLocation: boolean = true
    if (this.orgIdFromLocalHost) {
      var orgId = this.orgIdFromLocalHost
    } else {
      var orgId = this.selectedOrganization?.id
    }


    this.showUsers();

  }
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

            this.userArray = this.userData.map((item: any) => ({
              id: item.Id,
              name: item.FullName || item.UserName,
              ...item
            }));
          }
        }
      });
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

  onUserChange(event) {
    // this.rows = null;
  }

}
