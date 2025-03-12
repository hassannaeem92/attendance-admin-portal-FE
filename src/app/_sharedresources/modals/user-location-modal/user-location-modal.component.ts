import { ChangeDetectorRef, Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ColumnMode, NgxDatatableModule, SelectionType } from '@swimlane/ngx-datatable';
import { Page } from '../../page';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { TableFooterComponent } from '../../table-footer/table-footer.component';
import { QRCodeModule } from 'angularx-qrcode';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CompanyService } from '../../../views/_services/companies/company.service';
import { LocationService } from '../../../views/_services/location/location.service';
import { OrganizationService } from '../../../views/_services/organization/organization.service';
import { UserServiceService } from '../../../views/_services/user-service.service';
import { DateService } from '../../date-service/date.service';
import { Utils } from '../../../utils';

@Component({
  selector: 'app-user-location-modal',
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
    MatNativeDateModule,
    MatFormFieldModule,
    NgIf,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './user-location-modal.component.html',
  styleUrl: './user-location-modal.component.scss'
})
export class UserLocationModalComponent {

  constructor(private cdr: ChangeDetectorRef) {}

  @Input() locationsArray: any;

   readonly router = inject(Router);
    readonly route = inject(ActivatedRoute);
    readonly companyService = inject(CompanyService);
    readonly locationService = inject(LocationService);
    readonly organizationService = inject(OrganizationService);
    readonly userService = inject(UserServiceService);
    readonly utils = inject(Utils);
    readonly dateService = inject(DateService);

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

  isActive?: boolean;

  rows: any = [];

  ngOnChanges(changes: SimpleChanges): void {
    
    if(changes['locationsArray'].currentValue){
      this.setPage({ offset: 0 }, true, changes['locationsArray'].currentValue);
    }
  }

  // setPage(pageInfo: any, flag?: any, arr?: any) {
  //   // this.selected = [];
  //   this.rows = [];

  //   setTimeout(() => {
      
  //     this.rows = JSON.parse(JSON.stringify(arr));
  //     this.page.totalElements = (this.rows.CompanyLocation?.length + this.rows.OrganizationLocation?.length);
  //   }, 200)

  //   this.cdr.markForCheck();
  // }


  setPage(pageInfo: any, flag?: any, arr?: any) {
    // Reset the rows array
    this.rows = [];
  
    setTimeout(() => {
      // Ensure arr has valid data and contains both OrganizationLocation and CompanyLocation
      if (arr && arr.OrganizationLocation || arr.CompanyLocation) {
        
        // First loop through OrganizationLocation
        if(arr.OrganizationLocation && arr.OrganizationLocation.length > 0){
          arr.OrganizationLocation.forEach((orgLocation: any) => {
            // For each orgLocation, loop through CompanyLocation separately
            
              // Create and push rows with orgLocation and comLocation data
              this.rows.push({
                id: orgLocation?.Id || '', // Assuming `Id` is part of `orgLocation`
                name: arr?.FullName || '', // Assuming `FullName` is part of `arr`
                role: arr?.Role || '', // Assuming `Role` is part of `arr`
                orgLocation: orgLocation?.Name || '', // Organization location name
                comLocation: '' // Company location name
              });
            
          });
        }
  
        // Separate loop for CompanyLocation if required
        if(arr.CompanyLocation && arr.CompanyLocation.length > 0){

          arr.CompanyLocation.forEach((comLocation: any) => {
            
              // Create and push rows with orgLocation and comLocation data
              this.rows.push({
                id: comLocation?.Id || '', // Assuming `Id` is part of `orgLocation`
                name: arr?.FullName || '', // Assuming `FullName` is part of `arr`
                role: arr?.Role || '', // Assuming `Role` is part of `arr`
                orgLocation: '', // Organization location name
                comLocation: comLocation?.Name || '' // Company location name
              });
            
          });
        }
  
      }
  
      // Trigger change detection after updating the rows array
      this.rows = [...this.rows]; // Create a new reference for rows to trigger change detection
      this.page.totalElements = this.rows.length; // Set the total elements count
  
      this.cdr.markForCheck(); // Mark for change detection
    }, 200);
  }
  
  
  

  getLocationAddress(row: any): string {
    return (row.CompanyLocation?.[0]?.Company?.Name) || 
       (row.OrganizationLocation?.[0]?.Organization?.Name) || 
       '';
  }
}
