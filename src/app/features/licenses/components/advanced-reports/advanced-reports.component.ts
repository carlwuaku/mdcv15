import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { combineLatest, Observable, Subject, take, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { LicensesService } from '../../licenses.service';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app/app.service';
import { LoadDataListComponent } from 'src/app/shared/components/load-data-list/load-data-list.component';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { ApiResponseObject } from 'src/app/shared/types/ApiResponseObject';
@Component({
  selector: 'app-advanced-reports',
  templateUrl: './advanced-reports.component.html',
  styleUrls: ['./advanced-reports.component.scss']
})
export class AdvancedReportsComponent implements OnInit, OnDestroy {
  queryParams: { [key: string]: string } = {};
  licenseType: string | undefined;
  destroy$: Subject<boolean> = new Subject();
  AdvancedReportsBaseUrl: string = "licenses/details/filter";
  AdvancedReportsUrl: string = "licenses/details/filter";
  AdvancedReportsFilters: IFormGenerator[] = [];
  @ViewChild('advancedReportsList') advancedReportsList!: LoadDataListComponent;
  apiCallData: Record<string, any> = {};
  selectedItems: any[] = [];
  /** keep track of the fields that should have child_ appended to them. on the server these are treated specially */
  childFilterNames: string[] = [];
  constructor(private ar: ActivatedRoute, private router: Router, private licensesService: LicensesService, private appService: AppService) {


  }
  ngOnInit(): void {
    combineLatest([
      this.ar.queryParams,
      this.ar.paramMap
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe(([queryParams, params]) => {
      this.licenseType = params.get('type') ?? undefined;
      this.queryParams = queryParams;
      if (this.licenseType) {
        this.appService.appSettings.pipe(take(1)).subscribe(data => {
          this.AdvancedReportsFilters = [...data?.advancedStatisticsFilterFields, ...data?.licenseTypes[this.licenseType!]?.advancedStatisticsFields];

          this.childFilterNames = data?.licenseTypes[this.licenseType!]?.advancedStatisticsFields.map((filter) => filter.name);
          //populate the filters with the query param values
          this.AdvancedReportsFilters.map((filter: IFormGenerator) => {
            if (this.queryParams[filter.name] || this.queryParams[`child_${filter.name}`]) {
              const value = this.queryParams[filter.name] ? this.queryParams[filter.name] : this.queryParams[`child_${filter.name}`];
              if (filter.selection_mode === 'multiple') {
                filter.value = value.split(',');
              }
              else {
                filter.value = value;
              }
            }
          }
          );
        })

        // this.appService.appSettings.pipe(take(1)).subscribe(data => {
        //   this.AdvancedReportsFilters = data?.licenseTypes[this.licenseType]?.advancedStatisticsFields;
        //   this.AdvancedReportsFilters.forEach(filter => {
        //     filter.value = this.queryParams[`child_${filter.name}`];
        //   });
        // })
        this.AdvancedReportsUrl = this.AdvancedReportsBaseUrl + "?licenseType=" + this.licenseType;
        // this.advancedReportsList?.getData();
      }
    });

  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onLicenseTypeChange(selectedValue: string) {
    this.router.navigate(['licenses/advanced-reports'], { queryParams: { licenseType: selectedValue } });
  }



  filterSubmitted = (params: IFormGenerator[]) => {

    const data: Record<string, any> = {};
    params.forEach((param) => {
      if (param.value && param.value.length > 0) {
        if (this.childFilterNames.includes(param.name)) {
          data[`child_${param.name}`] = param.value;
        }
        else {
          data[param.name] = param.value;
        }
        // data[`child_${param.name}`] = param.value;
      }
    });
    data['licenseType'] = this.licenseType;
    this.apiCallData = data;
  }

  setSelectedItems(objects: any[]): void {
    this.selectedItems = objects;
  }
}
