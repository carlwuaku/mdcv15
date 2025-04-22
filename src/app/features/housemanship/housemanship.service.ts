import { Injectable } from '@angular/core';
import { forkJoin, Observable, switchMap } from 'rxjs';
import { HttpService } from 'src/app/core/services/http/http.service';
import { ApiResponseObject } from 'src/app/shared/types/ApiResponseObject';
import { HousemanshipFacility } from './models/Housemanship_facility.model';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { HousemanshipFacilityAvailability } from './models/Housemanship_facility_availability.model';
import { HousemanshipFacilityCapacity } from './models/Housemanship_facility_capacity.model';
import { HousemanshipDiscipline } from './models/Housemanship_discipline.model';

@Injectable({
  providedIn: 'root'
})
export class HousemanshipService {

  constructor(private dbService: HttpService) { }

  deleteFacility(id: string): Observable<{ message: string }> {
    return this.dbService.delete(`housemanship/facilities/details/${id}`);
  }

  getFacilityFormConfig(): Observable<{ data: IFormGenerator[] }> {
    return this.dbService.get(`housemanship/facilities/details/form`)
  }

  getFacilityDetails(id: string): Observable<{ data: HousemanshipFacility, displayColumns: string[] }> {
    return this.dbService.get(`housemanship/facilities/details/${id}`);
  }

  deleteFacilityCapacity(id: string): Observable<{ message: string }> {
    return this.dbService.delete(`housemanship/facilities/capacities/${id}`);
  }
  getFacilityCapacityFormConfig(): Observable<{ data: IFormGenerator[] }> {
    return this.dbService.get(`housemanship/facilities/capacities/form`)
  }

  getDisciplineFormConfig(): Observable<{ data: IFormGenerator[] }> {
    return this.dbService.get(`housemanship/disciplines/form`)
  }

  deleteDiscipline(id: string): Observable<{ message: string }> {
    return this.dbService.delete(`housemanship/disciplines/${id}`);
  }

  restoreDiscipline(id: string): Observable<{ message: string }> {
    return this.dbService.put(`housemanship/disciplines/${id}/restore`, {});
  }

  getFacilityAvailability(year: string, facility_name: string): Observable<{ data: HousemanshipFacilityAvailability[], displayColumns: string[] }> {
    return this.dbService.get(`housemanship/facilities/availabilities?year=${year}&facility_name=${facility_name}`);
  }

  createFacilityAvailability(data: HousemanshipFacilityAvailability): Observable<{ message: string }> {
    const formdata = new FormData();
    formdata.append('year', data.year);
    formdata.append('facility_name', data.facility_name);
    formdata.append('category', data.category);
    formdata.append('available', data.available.toString());
    return this.dbService.post(`housemanship/facilities/availabilities`, formdata);
  }

  getDisciplines(): Observable<{ data: HousemanshipDiscipline[], displayColumns: string[] }> {
    return this.dbService.get(`housemanship/disciplines`);
  }

  getFacilityCapacities(year: string, facility_name: string): Observable<{ data: HousemanshipFacilityCapacity[], displayColumns: string[] }> {
    return this.dbService.get(`housemanship/facilities/capacities?facility_name=${facility_name}&year=${year}`);
  }

  getFacilityDisciplineAndCapacities(year: string, facility_name: string): Observable<{
    disciplines: { data: HousemanshipDiscipline[], displayColumns: string[] },
    capacities: { data: HousemanshipFacilityCapacity[], displayColumns: string[] }
  }> {
    return forkJoin({
      disciplines: this.getDisciplines(),
      capacities: this.getFacilityCapacities(year, facility_name)
    });
  }

  createFacilityDisciplineCapacity(data: HousemanshipFacilityCapacity): Observable<{ message: string }> {
    const formdata = new FormData();
    formdata.append('year', data.year);
    formdata.append('facility_name', data.facility_name);
    formdata.append('discipline', data.discipline);
    formdata.append('capacity', data.capacity.toString());
    return this.dbService.post(`housemanship/facilities/availabilities`, formdata);
  }

  deletePosting(id: string): Observable<{ message: string }> {
    return this.dbService.delete(`housemanship/posting/${id}`);
  }

  getPostingFormConfig(session: string): Observable<{ data: IFormGenerator[] }> {
    return this.dbService.get(`housemanship/posting/form/${session}`)
  }

  createPosting(data: { [key: string]: string }): Observable<{ message: string }> {

    return this.dbService.post(`housemanship/posting`, data);
  }
}
