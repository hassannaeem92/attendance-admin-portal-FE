import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { GlobalApiCallService } from '../../../_sharedresources/_services/global-api-call.service';

@Injectable({
  providedIn: 'root'
})
export class OffDayService {

  readonly globalApiService = inject(GlobalApiCallService);


  private getAllOffDayUrl = environment.userModuleApiBaseUrl + 'Attendance/GetAllOffDay';
  private getOffDayDetaByIdilUrl = environment.userModuleApiBaseUrl + 'Attendance/GetOffDayById';
  private addOffDayUrl = environment.userModuleApiBaseUrl + 'Attendance/AddEditOffDay';
  private deleteOffDayUrl = environment.userModuleApiBaseUrl + 'Attendance/DeleteOffDayById';
  private getAllShiftsUrl = environment.userModuleApiBaseUrl + 'Attendance/GetAllShift';
  private getAllDaysUrl = environment.userModuleApiBaseUrl + 'Attendance/GetAllDays';

  constructor() { }

  getAllOffDay(body: any, pIndex, orgId?,isActive?,isOrganization?){
    const options = {searchTerm: body.searchKeyword, isDropdown: body.isDropdown, organizationId: orgId ? orgId : '',isActive : isActive == null ? '' :isActive,isOrganization:isOrganization==null ? '' : isOrganization};
    const request = {PageIndex: pIndex, PageSize: body.pageSize};

    return this.globalApiService.postRequestParam(this.getAllOffDayUrl, request, options);
   
  }

  getAllShiftsDrop(){
    const options = {searchTerm: '', isDropdown: true, isActive: true};
    const request = {PageIndex: 0, PageSize: 0};

    return this.globalApiService.postRequestParam(this.getAllShiftsUrl, request, options);
   
  }

  getAllDaysDrop(){
    // const options = {searchTerm: '', isDropdown: true, isActive: true};
    // const request = {PageIndex: 0, PageSize: 0};

    return this.globalApiService.getRequest(this.getAllDaysUrl);
   
  }
  

  getOffDayById(body){
    // return this.globalApiService.getRequest(this.getOffDayDetaByIdilUrl, body);
    const urlWithQuery = `${this.getOffDayDetaByIdilUrl}?id=${body.id}`;
    return this.globalApiService.getRequest(urlWithQuery);
  }

  addEditOffDay(body){
    return this.globalApiService.postRequest(this.addOffDayUrl, body);
  }

  deleteOffDay(body){
    // return this.globalApiService.postRequest(this.deleteOffDayUrl, body);
    const urlWithQuery = `${this.deleteOffDayUrl}?id=${body.id}`;
    return this.globalApiService.getRequest(urlWithQuery);
  }

}
