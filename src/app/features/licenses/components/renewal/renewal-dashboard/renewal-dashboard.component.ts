import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, take, takeUntil } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { RenewalStageItems } from 'src/app/shared/utils/data';

@Component({
  selector: 'app-renewal-dashboard',
  templateUrl: './renewal-dashboard.component.html',
  styleUrls: ['./renewal-dashboard.component.scss']
})
export class RenewalDashboardComponent implements OnInit, OnDestroy {
  menuItems: RenewalStageItems[] = []
  destroy$: Subject<boolean> = new Subject();
  licenseType: string = "";
  filterFields: IFormGenerator[] = [];
  queryParams: { [key: string]: string } = {};
  baseUrl: string = "licenses/renewal";
  url: string = "licenses/renewal";
  constructor(private appService: AppService,
    private ar: ActivatedRoute, private router: Router, private changeDetectorRef: ChangeDetectorRef) {
    this.licenseType = ar.snapshot.params['type'];
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit(): void {

    this.ar.queryParams
      .pipe(takeUntil(this.destroy$)).subscribe(params => {
        this.queryParams = params;
        if (this.licenseType) {
          this.getMenuItems()
        }
      });
  }

  getMenuItems() {
    this.menuItems = [];
    this.appService.appSettings.pipe(take(1)).subscribe(data => {
      const stages = data.licenseTypes[this.licenseType] ?
        JSON.parse(JSON.stringify(data.licenseTypes[this.licenseType].renewalStages)) : {};
      const menuItems: RenewalStageItems[] = Object.keys(stages).map(key => stages[key]);
      //for any keys in the queryParams that are not in the apiCountUrl of each menu item, add them to the apiCountUrl as a query param
      menuItems.map(item => {
        if (item.apiCountUrl) {
          const apiCountUrlParams = item.apiCountUrl.split("?")[1];
          const apiCountUrlParamsArray = apiCountUrlParams.split("&").map(param => param.split("=")[0]);
          Object.keys(this.queryParams).forEach(key => {
            if (!apiCountUrlParamsArray.includes(key)) {
              if (!apiCountUrlParamsArray.includes(`child_${key}`)) {
                item.apiCountUrl += `&child_${key}=${this.queryParams[key]}`;
              }
            }
          });
        }
        const urlParamsArray = Object.keys(item.urlParams ?? []);
        if (!item.urlParams) {
          item.urlParams = {};
        }
        Object.keys(this.queryParams).forEach(key => {
          if (!urlParamsArray.includes(key)) {
            if (!urlParamsArray.includes(`child_${key}`)) {
              item.urlParams![`child_${key}`] = this.queryParams[key];
            }
          }
        });

      });
      this.filterFields = data.licenseTypes[this.licenseType].renewalFilterFields;
      //assign the values of the queryParams to the filterFields
      Object.keys(this.queryParams).forEach(key => {
        const filterField = this.filterFields.find(field => field.name === key || field.name === `child_${key}`);
        if (filterField) {
          filterField.value = this.queryParams[key];
        }
      });
      this.menuItems = menuItems;
      this.changeDetectorRef.detectChanges();
    });
  }

  onLicenseTypeChange(selectedValue: string) {
    this.router.navigate(['licenses/renewal-dashboard'], { queryParams: { license_type: selectedValue } });
  }

  filterSubmitted(params: string) {
    //split the params by & and then by =
    const paramsArray = params.split("&");
    const paramsObject: { [key: string]: string } = {};
    paramsArray.forEach(param => {
      const [key, value] = param.split("=");
      paramsObject[key] = value;
    });
    this.router.navigate([], { queryParams: paramsObject, relativeTo: this.ar });
  }

}
