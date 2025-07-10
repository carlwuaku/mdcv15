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
  selector: 'app-renewal-print-queue',
  templateUrl: './renewal-print-queue.component.html',
  styleUrls: ['./renewal-print-queue.component.scss']
})
export class RenewalPrintQueueComponent implements OnInit, OnDestroy {
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
    this.licenseType = ar.snapshot.params['type'];

  }

  ngOnInit(): void {

    this.ar.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {

      this.queryParams = params;

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

  getActions = (object: RenewalObject): DataActionsButton[] => {

    const actions: DataActionsButton[] = [
    ];


    return actions;
  }


  updateTimestamp() {
    this.ts = getToday("timestamp_string");
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


    this.router.navigate([], { queryParams: paramsObject, relativeTo: this.ar });

  }

  selectionChanged = (selected: RenewalObject[]) => {
    this.selectedItems = selected;
  }



  updatePrintQueue = (state: number) => {
    if (!this.selectedItems.length) {
      alert("Please select at least one item to add to the print queue");
      return;
    }
    //make sure all the selected items are at the correct stage and have the templates set
    const message = state === 1 ? "Add to print queue" : "Remove from print queue";
    if (!window.confirm(`Are you sure you want to ${message} for the selected items?`)) {
      return;
    }
    //make sure all the selected items are at the correct stage and have the templates set
    //get the printable statuses from the app settings
    const printableStatuses: string[] = [];
    this.appService.appSettings?.pipe(take(1)).subscribe(data => {
      const stages = data?.licenseTypes[this.licenseType]?.renewalStages;
      if (!stages) {
        alert("No stages found for this license type");
        return;
      }
      Object.values(stages).forEach((stage) => {
        if (stage.printable) {
          printableStatuses.push(stage.title);
        }
      });
      let anyInvalid = false;
      for (let i = 0; i < this.selectedItems.length; i++) {
        const item = this.selectedItems[i];
        if (!printableStatuses.includes(item.status)) {
          alert(`All selected items must be at a printable stage (${printableStatuses.join(", ")}) to print. ${item.license_number} is not at a printable stage`);
          anyInvalid = true;
          break;
        }
        //make sure the template is set
        if (!item.print_template) {
          anyInvalid = true;
          alert(`Please set a print template for ${item.license_number} before adding to print queue`);
          break;
        }
      }
      if (anyInvalid) {
        return;
      }

      //update the licenses to set in_print_queue to true
      const renewalData = this.selectedItems.map(item => {
        return {
          uuid: item.uuid,
          in_print_queue: state
        }
      }
      );
      this.renewalService.updateBulkRenewals(renewalData, "").subscribe({
        next: (res) => {
          this.notify.successNotification("Items added to print queue");
          this.updateTimestamp();
        }
      });
    });
  }

  onPrint() {
    if (!this.selectedItems.length) {
      alert("Please select at least one item to print");
      return;
    }
    //make sure all the selected items are at the correct stage and have the templates set
    const printableStatuses: string[] = [];
    this.appService.appSettings?.pipe(take(1)).subscribe(data => {
      const stages = data?.licenseTypes[this.licenseType]?.renewalStages;
      if (!stages) {
        alert("No stages found for this license type");
        return;
      }
      Object.values(stages).forEach((stage) => {
        if (stage.printable) {
          printableStatuses.push(stage.title);
        }
      });
      let anyInvalid = false;
      for (let i = 0; i < this.selectedItems.length; i++) {
        const item = this.selectedItems[i];
        if (!printableStatuses.includes(item.status)) {
          alert(`All selected items must be at a printable stage (${printableStatuses.join(", ")}) to print. ${item.license_number} is not at a printable stage`);
          anyInvalid = true;
          break;
        }
        //make sure the template is set
        if (!item.print_template) {
          anyInvalid = true;
          alert(`Please set a print template for ${item.license_number}`);
          break;
        }
      }
      if (anyInvalid) {
        return;
      }
      //get the print templates contents for the selected items
      const templates = this.selectedItems.map(item => item.print_template).filter(template => template);
      if (templates.length === 0) {
        alert("No print templates found for the selected items.");
        return;
      }
      this.renewalService.getPrintTemplates(templates).pipe(take(1)).subscribe({
        next: (res) => {
          if (!res || !res.data) {
            alert("Failed to load print templates. Please try again later.");
            return;
          }
          // convert the response to a map
          const templateMap: { [key: string]: string } = {};
          res.data.forEach(template => {
            templateMap[template.template_name] = template.template_content;
          });

          const renewalPrintData = this.selectedItems.map(item => {
            return {
              type: "Renewal",
              content: "",
              template: templateMap[item.print_template] || "", // Fallback to empty string if template not found
              data: item,
              unique_id: item.license_number,
              table_name: "licenses_renewal",
              table_row_uuid: item.uuid
            }
          });

          this.renewalService.printRenewals(renewalPrintData).subscribe((res) => {
            openHtmlInNewWindow(res.data);
          });
          // Check if the response contains the templates}
        },
        error: (err) => {
          console.error("Error loading print templates:", err);
        }
      },





      )
    });




  }
}
