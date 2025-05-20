import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, take, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { LicensesService } from '../../licenses.service';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app/app.service';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
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
  constructor(private ar: ActivatedRoute, private router: Router, private licensesService: LicensesService, private appService: AppService) {

  }
  ngOnInit(): void {
    this.ar.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {

      this.queryParams = params;
      this.licenseType = params['licenseType'];
      if (this.licenseType) {
        this.getBasicReports();
        this.getTotal();
        this.appService.appSettings.pipe(take(1)).subscribe(data => {
          this.basicReportsFilters = data?.licenseTypes[this.licenseType]?.basicStatisticsFilterFields
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

  getBasicReports() {
    this.basicReportsLoading = true;
    this.licensesService.getBasicReports(this.licenseType, this.queryParams).subscribe({
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

  getTableData(data: any[]) {
    return new MatTableDataSource(data);
  }


  onBasicReportsFormSubmitted(params: IFormGenerator[]) {
    const data: Record<string, any> = {};
    params.forEach((param) => {
      if (param.value && param.value.length > 0) {
        data[`child_${param.name}`] = param.value;
      }

    });
    data['licenseType'] = this.licenseType;

    this.licensesService.getFilteredCount(data).subscribe({
      next: (res) => {
        this.total = res.data;
      }
    });
    this.basicReportsLoading = true;
    this.licensesService.filterBasicReports(this.licenseType, data).subscribe({
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

  getTotal() {
    this.licensesService.getCount(this.queryParams).subscribe({
      next: (res) => {
        this.total = res.data;
      }
    });
  }

  setSelectedItems(objects: any[], key: string): void {
    this.selectedItems[key] = objects;
  }

  getSelectedItems(key: string): any[] {
    return this.selectedItems[key] || [];
  }
}
