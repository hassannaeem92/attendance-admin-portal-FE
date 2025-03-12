import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalApiCallService {

  constructor(private httpClient: HttpClient) { }


  //post

  postRequest(apiUrl: any, requestBody: any, paramHeaders?: Record<string, string>): Observable<any> {
    const headers = paramHeaders 
      ? { headers: new HttpHeaders(paramHeaders) } 
      : {};
  
    return this.httpClient.post<any>(apiUrl, requestBody, headers).pipe(
      catchError(error => {
        console.error('Error occurred:', error); // Log the error
        return throwError(() => new Error('Failed to process the request. Please try again later.'));
      })
    );
  }

  postMultipartRequest(apiUrl: string, formData: FormData, paramHeaders?: Record<string, string>): Observable<any> {
    // Do not set 'Content-Type' explicitly for multipart/form-data
    const headers = paramHeaders 
      ? new HttpHeaders({ ...paramHeaders }) 
      : undefined; // If no headers are provided, keep it undefined
    
    return this.httpClient.post<any>(apiUrl, formData, { headers }).pipe(
      catchError(error => {
        console.error('Error occurred during multipart request:', error); // Log the error
        return throwError(() => new Error('Failed to process the multipart request. Please try again later.'));
      })
    );
  }
  
  

  postRequestParam(apiUrl: string, requestBody: any, queryParams?: Record<any, any>): Observable<any> {
    const params = queryParams 
      ? { params: new HttpParams({ fromObject: queryParams }) } 
      : {};
  
    return this.httpClient.post<any>(apiUrl, requestBody, { ...params }).pipe(
      catchError(error => {
        console.error('Error occurred:', error); // Log the error
        return throwError(() => new Error('Failed to process the request. Please try again later.'));
      })
    );
  }
  




  

  getRequest(apiUrl: string, params?: any, paramHeaders?: HttpHeaders): Observable<any> {
    const headers = paramHeaders || new HttpHeaders(); // Use provided headers or default
    return this.httpClient.get<any>(apiUrl, { params, headers }).pipe(
      catchError((error) => {
        console.error('Error occurred:', error); // Log error
        return throwError(() => new Error('Something went wrong. Please try again later.'));
      })
    );
  }

  // postRequestWithBlob(apiUrl, requestBody, type?): Observable<any> {
  //   return this.httpClient.post(apiUrl, requestBody, { responseType: 'blob' })
  //     .pipe(
  //       map(res => new Blob([res], { type }))
  //     );
  // }

  postRequestWithBlob(apiUrl: string, requestBody: any, queryParams?: Record<string, any>, type?: string): Observable<Blob> {
    const params = queryParams 
      ? { params: new HttpParams({ fromObject: queryParams }), responseType: 'blob' as 'json' }
      : { responseType: 'blob' as 'json' };

    return this.httpClient.post(apiUrl, requestBody, params).pipe(
        map((res: any) => new Blob([res], { type })),
        catchError(error => {
            console.error('Blob request failed:', error);
            return throwError(() => new Error('Failed to process the Blob request.'));
        })
    );
}

  downloadPrintFunctionality(fileType: any, data: any, reportName: any, div: string) {
     
      if (fileType == 'pdf') {
        this.directPrint(data);
      } else if (fileType == 'xlsx' || fileType == 'csv') {
        if (data) {
          // let fileName = reportName + fileType + ".";
          let fileName = reportName + ".";
          let body = (data as any);
          var blob = new Blob([body]);
          var link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = fileName + (fileType == 'csv' ? 'xlsx' : fileType);
          link.click();
        }
      }
    
    document.body.style.cursor = 'default';
  }
  
  directPrint(data) {
    let body = (data as any);
    var blob = new Blob([body], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    let pdfWindow = window.open(url);
    setTimeout(() => {
      if (pdfWindow) {
        pdfWindow.focus();
        pdfWindow.print();
      }
    }, 1000);
  }

}
