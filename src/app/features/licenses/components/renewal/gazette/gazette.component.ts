import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, take, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app/app.service';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { LicensesService } from '../../../licenses.service';
import { RenewalObject } from '../renewal.model';
import { getThisYear, getToday } from 'src/app/shared/utils/dates';
@Component({
  selector: 'app-gazette',
  templateUrl: './gazette.component.html',
  styleUrls: ['./gazette.component.scss']
})
export class GazetteComponent implements OnInit, OnDestroy {

  queryParams: { [key: string]: string } = {};
  licenseType: string = "";
  destroy$: Subject<boolean> = new Subject();
  basicReportsFilters: any[] = [];
  dataSource: MatTableDataSource<RenewalObject> = new MatTableDataSource<any>([]);
  selectedItems: Record<string, any[]> = {};
  /** keep track of the fields that should have renewal_ appended to them. on the server these are treated specially */
  childFilterNames: string[] = [];
  loading: boolean = false;
  formData: Record<string, any> = {};
  offset: number = 0;
  limit: number = 100;
  totalRows: number = 0;
  currentPage: any = 1;
  displayedColumns: string[] = ['name', 'postal_address', 'qualification', 'qualification_date'];
  columnLabels: Record<string, string> = {
    name: 'Name',
    postal_address: 'Postal Address',
    qualification: 'Qualification',
    qualification_date: 'Qualification Date'
  }
  getYear = (date: string) => { return getToday("year", date) }; // This is used to get the current year for the filter
  constructor(private ar: ActivatedRoute, private router: Router, private licensesService: LicensesService, private appService: AppService) {
    this.licenseType = ar.snapshot.params['type'];

  }
  ngOnInit(): void {
    this.ar.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {

      this.queryParams = params;
      if (this.licenseType) {
        this.appService.appSettings.pipe(take(1)).subscribe(data => {
          this.basicReportsFilters = [...data?.renewalBasicStatisticsFilterFields, ...data?.licenseTypes[this.licenseType]?.renewalBasicStatisticsFilterFields];

          this.childFilterNames = data?.licenseTypes[this.licenseType]?.renewalBasicStatisticsFilterFields.map((filter) => filter.name);
          //populate the filters with the query param values
          this.basicReportsFilters.map((filter) => {
            if (this.queryParams[filter.name]) {
              filter.value = this.queryParams[filter.name].split(',');
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
    this.router.navigate(['licenses/gazette'], { queryParams: { license_type: selectedValue } });
  }



  getTableData(data: any[]) {
    return new MatTableDataSource(data);
  }


  onBasicReportsFormSubmitted(params: IFormGenerator[]) {
    const data: Record<string, any> = {};
    params.forEach((param) => {
      if (param.value && param.value.length > 0) {
        if (this.childFilterNames.includes(param.name)) {
          data[`renewal_${param.name}`] = param.value;
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
    data['license_type'] = this.licenseType;
    data['isGazette'] = true;
    this.loading = true;
    this.licensesService.postRenewalFilter(data, { limit: this.limit.toString(), page: this.offset.toString() }).pipe(take(1)).subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.data);
        this.totalRows = res.total;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.totalRows = 0;
        this.dataSource = new MatTableDataSource<RenewalObject>([]);
      }
    });
  }

  setPage(page: number) {
    this.currentPage = page;
    this.offset = (page - 1) * this.limit;
    this.getData();
  }
  setLimit(limit: number) {

    this.limit = limit;
    this.currentPage = 1;
    this.offset = 0;
    this.getData();
  }

}
