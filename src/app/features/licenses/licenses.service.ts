import { Injectable } from '@angular/core';

import { Observable, switchMap, throwError } from 'rxjs';
import { HttpService } from 'src/app/core/services/http/http.service';
import { LicenseObject } from './models/license_model';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { ApiResponseObject } from 'src/app/shared/types/ApiResponseObject';
@Injectable({
  providedIn: 'root'
})
export class LicensesService {

  constructor(private dbService: HttpService) {

  }

  getLicenseDetails(uuid: string): Observable<{ data: LicenseObject, displayColumns: string[], columnLabels: { [key: string]: string } }> {
    return this.dbService.get(`licenses/details/${uuid}`)
  }

  delete(uuid: string): Observable<{ message: string }> {
    if (!window.confirm('Are you sure you want to delete this license permanently? You cannot undo this action.')) {
      return throwError(() => new Error('User cancelled delete'));
    }
    return this.dbService.delete<{ message: string }>("licenses/details/" + uuid)
  }

  update(uuid: string, data: { [key: string]: string }): Observable<{ message: string }> {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      formData.append(key, data[key])
    })
    formData.append("uuid", uuid);
    return this.dbService.put(`licenses/details/${uuid}`, formData)
  }




  getLicenseFormConfig(type: string): Observable<{ data: IFormGenerator[] }> {
    return this.dbService.get(`licenses/config/${type}`)
  }

  getBasicReports(licenseType: string, queryParams: { [key: string]: string }): Observable<{ data: { [key: string]: { data: any[], label: string, type: string, labelProperty: string, valueProperty: string, chartTitle: string, xAxisLabel: string, yAxisLabel: string } } }> {
    const baseUrl = `licenses/reports/basic-statistics/${licenseType}`;
    let paramArray: string[] = [];
    Object.keys(queryParams).forEach(key => {
      paramArray.push(`${key}=${queryParams[key]}`)
    })
    return this.dbService.get(baseUrl + "?" + paramArray.join("&"))
  }

  getCount(queryParams: { [key: string]: string }): Observable<{ data: string }> {
    let paramArray: string[] = [];
    Object.keys(queryParams).forEach(key => {
      paramArray.push(`${key}=${queryParams[key]}`)
    })
    return this.dbService.get(`licenses/count?${paramArray.join("&")}`)
  }

  getFilteredCount(data: Record<string, any>): Observable<{ data: string }> {

    return this.dbService.post(`licenses/count`, data)
  }

  filterBasicReports(licenseType: string, data: Record<string, any>): Observable<{ data: { [key: string]: { data: any[], label: string, type: string, labelProperty: string, valueProperty: string, chartTitle: string, xAxisLabel: string, yAxisLabel: string } } }> {
    return this.dbService.post(`licenses/reports/basic-statistics/${licenseType}`, data)
  }

  postAdvancedReportsFilter(data: Record<string, any>): Observable<ApiResponseObject<any>> {

    return this.dbService.post(`licenses/details/filter`, data)
  }

  /**
   * Makes a GET request to the API to retrieve the basic statistics report
   * for a given license type and set of query parameters.
   *
   * @param licenseType The type of license to retrieve the report for.
   * @param queryParams Any additional query parameters to include in the request.
   * @returns An Observable containing the response data.
   */
  getRenewalBasicReports(licenseType: string, queryParams: { [key: string]: string },): Observable<{ data: { [key: string]: { data: any[], label: string, type: string, labelProperty: string, valueProperty: string, chartTitle: string, xAxisLabel: string, yAxisLabel: string } } }> {
    const baseUrl = `licenses/renewal-reports/basic-statistics/${licenseType}`;
    let paramArray: string[] = [];
    Object.keys(queryParams).forEach(key => {
      paramArray.push(`${key}=${queryParams[key]}`)
    })
    return this.dbService.get(baseUrl + "?" + paramArray.join("&"))
  }

  getRenewalCount(queryParams: { [key: string]: string }): Observable<{ data: string }> {
    let paramArray: string[] = [];
    Object.keys(queryParams).forEach(key => {
      paramArray.push(`${key}=${queryParams[key]}`)
    })
    return this.dbService.get(`licenses/renewal-count?${paramArray.join("&")}`)
  }

  getRenewalFilteredCount(data: Record<string, any>): Observable<{ data: string }> {

    return this.dbService.post(`licenses/renewal-count`, data)
  }

  filterRenewalBasicReports(licenseType: string, data: Record<string, any>): Observable<{ data: { [key: string]: { data: any[], label: string, type: string, labelProperty: string, valueProperty: string, chartTitle: string, xAxisLabel: string, yAxisLabel: string } } }> {
    return this.dbService.post(`licenses/renewal-reports/basic-statistics/${licenseType}`, data)
  }

}
