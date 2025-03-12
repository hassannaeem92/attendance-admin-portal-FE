import { inject, Injectable } from '@angular/core';
import { GlobalApiCallService } from '../../../_sharedresources/_services/global-api-call.service';
import { environment } from '../../../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class EmployeeServiceService {

  readonly globalApiService = inject(GlobalApiCallService);


  private getAllEmployeeUrl = environment.userModuleApiBaseUrl + 'Employee/GetAllEmployee';

  constructor() { }

  getAllEmployee(){
    return this.globalApiService.getRequest(this.getAllEmployeeUrl);
  }

}
