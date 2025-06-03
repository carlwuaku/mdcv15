import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, take, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { LicensesService } from '../../licenses.service';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app/app.service';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { BasicStatisticField } from 'src/app/shared/types/AppSettings.model';
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit, OnDestroy {
  queryParams: { [key: string]: string } = {};
  licenseType: string = "";
  destroy$: Subject<boolean> = new Subject();
  basicReports: { data: any[], label: string, type: string, labelProperty: string, valueProperty: string, chartTitle: string, xAxisLabel: string, yAxisLabel: string }[] = [];
  basicReportsLoading: boolean = false;
  basicReportsFilters: any[] = [];
  total: string = "0";
  selectedItems: Record<string, any[]> = {};
  /** keep track of the fields that should have child_ appended to them. on the server these are treated specially */
  childFilterNames: string[] = [];
  availableFields: BasicStatisticField[] = [];
  selectedField: string[] = [];// this is used to keep track of the selected field in the filter dropdown
  formData: Record<string, any> = {};
  constructor(private ar: ActivatedRoute, private router: Router, private licensesService: LicensesService, private appService: AppService) {

  }
  ngOnInit(): void {
    this.ar.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {

      this.queryParams = params;
      this.licenseType = params['licenseType'];
      if (this.licenseType) {
        // this.getBasicReports();
        // this.getTotal();
        this.appService.appSettings.pipe(take(1)).subscribe(data => {
          this.basicReportsFilters = [...data?.basicStatisticsFilterFields, ...data?.licenseTypes[this.licenseType]?.basicStatisticsFilterFields];
          this.availableFields = data?.licenseTypes[this.licenseType]?.renewalBasicStatisticsFields;
          this.selectedField = [this.availableFields[0]?.name];
          this.childFilterNames = data?.licenseTypes[this.licenseType]?.basicStatisticsFilterFields.map((filter) => filter.name);
          //populate the filters with the query param values
          this.basicReportsFilters.map((filter: IFormGenerator) => {
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
      }
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onLicenseTypeChange(selectedValue: string) {
    this.router.navigate(['licenses/reports'], { queryParams: { licenseType: selectedValue } });
  }



  getTableData(data: any[]) {
    return new MatTableDataSource(data);
  }


  onBasicReportsFormSubmitted(params: IFormGenerator[]) {
    const data: Record<string, any> = {};
    params.forEach((param) => {
      if (param.value && param.value.length > 0) {
        if (this.childFilterNames.includes(param.name)) {
          data[`child_${param.name}`] = param.value;
        }
        else {
          data[param.name] = param.value;
        }
      }

    });
    this.formData = data;
    this.getData();
  }

  getData() {
    const data = this.formData;
    data['licenseType'] = this.licenseType;
    data['fields'] = this.selectedField;//an array is expected. for performance reasons we are only sending one field at a time. if more fields are needed, we can change this
    this.licensesService.getFilteredCount(data).pipe(take(1)).subscribe({
      next: (res) => {
        this.total = res.data;
      }
    });
    this.basicReportsLoading = true;
    this.licensesService.filterBasicReports(this.licenseType, data).pipe(take(1)).subscribe({
      next: (res) => {
        this.basicReports = Object.values(res.data);
        this.basicReportsLoading = false;
      },
      error: (err) => {
        this.basicReportsLoading = false;
        this.basicReports = [];
      }
    });

  }

  selectedFieldChange(selectedValue: string[]) {
    this.selectedField = selectedValue;
    this.getData();
  }


  setSelectedItems(objects: any[], key: string): void {
    this.selectedItems[key] = objects;
  }

  getSelectedItems(key: string): any[] {
    return this.selectedItems[key] || [];
  }
}
