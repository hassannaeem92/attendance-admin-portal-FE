import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { GlobalApiCallService } from '../../../_sharedresources/_services/global-api-call.service';

@Injectable({
  providedIn: 'root'
})
export class TimezoneService {

  readonly globalApiService = inject(GlobalApiCallService);


  private getAllTimezoneUrl = environment.userModuleApiBaseUrl + 'Organization/GetAllTimeZones';
  private getTimeZoneDetaByIdilUrl = environment.userModuleApiBaseUrl + 'Organization/GetTimeZoneById';
  private addTimezoneUrl = environment.userModuleApiBaseUrl + 'Organization/AddEditTimeZone';
  private deleteTimeZoneUrl = environment.userModuleApiBaseUrl + 'Organization/DeletetTimeZoneById';

  constructor() { }

  getAllTimezone(body: any, pIndex){
    const options = {searchTerm: body.searchKeyword, isDropdown: body.isDropdown, isActive: body.isActive};
    const request = {PageIndex: pIndex, PageSize: body.pageSize};

    return this.globalApiService.postRequestParam(this.getAllTimezoneUrl, request, options);
   
  }

  getTimezoneById(body){
    return this.globalApiService.getRequest(this.getTimeZoneDetaByIdilUrl, body);
  }

  addEditTimezone(body){
    return this.globalApiService.postRequest(this.addTimezoneUrl, body);
  }

  deleteTimezone(body){
    const urlWithQuery = `${this.deleteTimeZoneUrl}?id=${body.id}`;
    return this.globalApiService.getRequest(urlWithQuery);
    // return this.globalApiService.postRequest(this.deleteTimeZoneUrl, body);
  }
}
