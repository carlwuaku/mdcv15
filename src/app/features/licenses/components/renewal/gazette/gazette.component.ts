import { Component, OnDestroy, OnInit } from '@angular/core';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { RenewalObject } from '../renewal.model';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';
import { getToday } from 'src/app/shared/utils/dates';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, take, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { AppService } from 'src/app/app.service';
import { openHtmlInNewWindow } from 'src/app/shared/utils/helper';
import { RenewalService } from '../../../renewal.service';
@Component({
  selector: 'app-gazette',
  templateUrl: './gazette.component.html',
  styleUrls: ['./gazette.component.scss']
})
export class GazetteComponent implements OnInit, OnDestroy {

  baseUrl: string = "licenses/renewal";
  url: string = "licenses/renewal";
  ts: string = "";
  queryParams: { [key: string]: string } = {};
  licenseType: string = "";
  inlineFilters: string[] = ["start_date", "end_date"];
  destroy$: Subject<boolean> = new Subject();
  canPrint: boolean = false;
  selectedItems: RenewalObject[] = [];

  constructor(private authService: AuthService, private notify: NotifyService,
    private ar: ActivatedRoute, private router: Router, private renewalService: RenewalService,
    private appService: AppService) {


  }

  ngOnInit(): void {

    this.ar.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {

      this.queryParams = params;
      if (!this.licenseType) {
        this.licenseType = params['license_type'];
      }
      this.setUrl();

      this.canPrint = this.authService.currentUser?.permissions.includes(`Print_Renewal_Certificates_${this.licenseType}`) ?? false;
    });

  }
  setUrl() {
    let queryParams = "";
    const queryParamsKeys = Object.keys(this.queryParams);
    queryParamsKeys.forEach(key => {
      queryParams += queryParams === "" ? "?" : "&";
      queryParams += `${key}=${this.queryParams[key]}`;
    });
    //make sure the in_print_queue is set to 1
    if (!queryParamsKeys.includes("in_print_queue") || this.queryParams["in_print_queue"] !== "1") {
      queryParams += queryParams === "" ? "?" : "&";
      queryParams += `in_print_queue=1`;
    }
    this.url = this.baseUrl + queryParams;
  }

  updateTimestamp() {
    this.ts = getToday("timestamp_string");
  }

  getActions = (object: RenewalObject) => {
    const actions: DataActionsButton[] = [
    ];
    return actions;
  }

  onLicenseTypeChange(selectedValue: string) {
    this.router.navigate(['licenses/renewal-print-queue'], { queryParams: { license_type: selectedValue, in_print_queue: 1 } });
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  filterSubmitted = (params: string) => {

    //split the params by & and then by =
    const paramsArray = params.split("&");
    const paramsObject: { [key: string]: string } = {};
    paramsArray.forEach(param => {
      const [key, value] = param.split("=");
      paramsObject[key] = value;
    });
    //maintain the license_type and in_print_queue params
    paramsObject["license_type"] = this.licenseType;
    if (!paramsObject["in_print_queue"]) {
      paramsObject["in_print_queue"] = "1";
    }


    this.router.navigate(['licenses/renewal-print-queue'], { queryParams: paramsObject });

  }

  selectionChanged = (selected: RenewalObject[]) => {
    this.selectedItems = selected;
  }
}
