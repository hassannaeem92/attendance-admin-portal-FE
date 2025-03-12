import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { GlobalApiCallService } from '../../../_sharedresources/_services/global-api-call.service';

@Injectable({
  providedIn: 'root'
})
export class HolidayService {

  readonly globalApiService = inject(GlobalApiCallService);


  private getAllHolidaysUrl = environment.userModuleApiBaseUrl + 'Attendance/GetAllHolidays';
  private getHolidaysDetaByIdilUrl = environment.userModuleApiBaseUrl + 'Attendance/GetHolidaysById';
  private addHolidaysUrl = environment.userModuleApiBaseUrl + 'Attendance/AddEditHolidays';
  private deleteHolidaysUrl = environment.userModuleApiBaseUrl + 'Attendance/DeleteHolidaysById';
  private getAllShiftsUrl = environment.userModuleApiBaseUrl + 'Attendance/GetAllShift';

  constructor() { }

  getAllHolidays(body: any, pIndex, orgId?,isActive?,isOrganization?){
    const options = {searchTerm: body.searchKeyword, isDropdown: body.isDropdown, organizationId: orgId ? orgId : '',isActive : isActive == null ? '' :isActive,isOrganization:isOrganization==null ? '' : isOrganization};
    const request = {PageIndex: pIndex, PageSize: body.pageSize};

    return this.globalApiService.postRequestParam(this.getAllHolidaysUrl, request, options);
   
  }

  getAllShiftsDrop(){
    const options = {searchTerm: '', isDropdown: true, isActive: true};
    const request = {PageIndex: 0, PageSize: 0};

    return this.globalApiService.postRequestParam(this.getAllShiftsUrl, request, options);
   
  }

  getHolidaysById(body){
    // return this.globalApiService.getRequest(this.getHolidaysDetaByIdilUrl, body);
    const urlWithQuery = `${this.getHolidaysDetaByIdilUrl}?id=${body.id}`;
    return this.globalApiService.getRequest(urlWithQuery);
  }

  addEditHolidays(body){
    return this.globalApiService.postRequest(this.addHolidaysUrl, body);
  }

  deleteHolidays(body){
    // return this.globalApiService.postRequest(this.deleteHolidaysUrl, body);
    const urlWithQuery = `${this.deleteHolidaysUrl}?id=${body.id}`;
    return this.globalApiService.getRequest(urlWithQuery);
  }



}

