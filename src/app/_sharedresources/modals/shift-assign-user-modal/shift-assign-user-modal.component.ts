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
import { set } from 'date-fns';

@Component({
  selector: 'app-shift-assign-user-modal',
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
  templateUrl: './shift-assign-user-modal.component.html',
  styleUrl: './shift-assign-user-modal.component.scss'
})
export class ShiftAssignUserModalComponent implements OnChanges{

  constructor(private cdr: ChangeDetectorRef) {}

  @Input() shiftAssignArray: any;

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
    
    if(changes['shiftAssignArray'].currentValue){
      this.setPage({ offset: 0 }, true, changes['shiftAssignArray'].currentValue);
    }
  }

  setPage(pageInfo: any, flag?: any, arr?: any) {
    // this.selected = [];
    this.rows = [];

    setTimeout(() => {
      
      this.rows = JSON.parse(JSON.stringify(arr));
      this.page.totalElements = this.rows && this.rows.length ? this.rows.length : 0;
    }, 200)

    this.cdr.markForCheck();
  }

  getLocationAddress(row: any): string {
    return (row.CompanyLocation?.[0]?.Company?.Name) || 
       (row.OrganizationLocation?.[0]?.Organization?.Name) || 
       '';
  }
}