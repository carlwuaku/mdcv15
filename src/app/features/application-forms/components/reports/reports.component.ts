import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, take, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { BasicStatisticField } from 'src/app/shared/types/AppSettings.model';
import { ApplicationFormService } from '../../application-form.service';

@Component({
  selector: 'app-application-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ApplicationReportsComponent implements OnInit, OnDestroy {
  queryParams: { [key: string]: string } = {};
  destroy$: Subject<boolean> = new Subject();
  basicReports: { data: any[], label: string, type: string, labelProperty: string, valueProperty: string, chartTitle: string, xAxisLabel: string, yAxisLabel: string }[] = [];
  basicReportsLoading: boolean = false;
  basicReportsFilters: any[] = [];
  total: number = 0;
  selectedItems: Record<string, any[]> = {};
  availableFields: BasicStatisticField[] = [];
  selectedField: string[] = [];
  formData: Record<string, any> = {};

  constructor(
    private ar: ActivatedRoute,
    private router: Router,
    private applicationFormService: ApplicationFormService
  ) { }

  ngOnInit(): void {
    this.ar.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.queryParams = params;
      this.loadReportFields();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  loadReportFields(): void {
    this.applicationFormService.getReportFields().pipe(take(1)).subscribe({
      next: (res) => {
        this.basicReportsFilters = res.data.filterFields || [];
        this.availableFields = res.data.reportFields || [];

        if (this.availableFields.length > 0) {
          this.selectedField = [this.availableFields[0]?.name];
        }

        // Populate filters with query param values
        this.basicReportsFilters.forEach((filter: IFormGenerator) => {
          if (this.queryParams[filter.name]) {
            const value = this.queryParams[filter.name];
            if (filter.selection_mode === 'multiple') {
              filter.value = value.split(',');
            } else {
              filter.value = value;
            }
          }
        });
      },
      error: (err) => {
        console.error('Error loading report fields:', err);
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
        data[param.name] = param.value;
      }
    });
    this.formData = data;
    this.getData();
  }

  getData() {
    const data = { ...this.formData };
    data['fields'] = this.selectedField;

    // Get total count
    this.applicationFormService.getFilteredCount(data).pipe(take(1)).subscribe({
      next: (res) => {
        this.total = res.data;
      }
    });

    // Get statistics
    this.basicReportsLoading = true;
    this.applicationFormService.filterBasicReports(data).pipe(take(1)).subscribe({
      next: (res) => {
        this.basicReports = Object.values(res.data);
        this.basicReportsLoading = false;
      },
      error: (err) => {
        console.error('Error loading reports:', err);
        this.basicReportsLoading = false;
        this.basicReports = [];
      }
    });
  }

  selectedFieldChange(selectedValue: string[]) {
    this.selectedField = selectedValue;
    if (this.selectedField.length > 0) {
      this.getData();
    }
  }

  setSelectedItems(objects: any[], key: string): void {
    this.selectedItems[key] = objects;
  }

  getSelectedItems(key: string): any[] {
    return this.selectedItems[key] || [];
  }
}
