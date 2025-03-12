import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { GlobalApiCallService } from '../../../_sharedresources/_services/global-api-call.service';

@Injectable({
  providedIn: 'root'
})
export class ShiftService {
 readonly globalApiService = inject(GlobalApiCallService);


  private getAllShiftUrl = environment.userModuleApiBaseUrl + 'Attendance/GetAllShift';
  private getShiftDetaByIdilUrl = environment.userModuleApiBaseUrl + 'Attendance/GetShiftById';
  private addShiftUrl = environment.userModuleApiBaseUrl + 'Attendance/AddEditShift';
  private deleteShiftUrl = environment.userModuleApiBaseUrl + 'Attendance/DeleteShiftById';

  constructor() { }

  getAllShift(body: any, pIndex, orgId?,isActive?,isOrganization? ){
    
    const options = {searchTerm: body.searchKeyword, isDropdown: body.isDropdown, organizationId: orgId ? orgId : '',isActive : isActive == null ? '' :isActive,isOrganization:isOrganization==null ? '' : isOrganization};
    const request = {PageIndex: pIndex, PageSize: body.pageSize};

    return this.globalApiService.postRequestParam(this.getAllShiftUrl, request, options);
   
  }

  getAllShiftsDrop(){
    const options = {searchTerm: '', isDropdown: true, isActive: true};
    const request = {PageIndex: 0, PageSize: 0};

    return this.globalApiService.postRequestParam(this.getAllShiftUrl, request, options);
   
  }

  getShiftById(body){
    // return this.globalApiService.getRequest(this.getShiftDetaByIdilUrl, body);
    const urlWithQuery = `${this.getShiftDetaByIdilUrl}?id=${body.id}`;
    return this.globalApiService.getRequest(urlWithQuery);
  }

  addEditShift(body){
    return this.globalApiService.postRequest(this.addShiftUrl, body);
  }

  deleteShift(body){
    // return this.globalApiService.postRequest(this.deleteShiftUrl, body);
    const urlWithQuery = `${this.deleteShiftUrl}?id=${body.id}`;
    return this.globalApiService.getRequest(urlWithQuery);
  }

}
