import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpService } from 'src/app/core/services/http/http.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { RenewalObject } from './renewal.model';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';
import { getToday } from 'src/app/shared/utils/dates';
import { ActivatedRoute, Router } from '@angular/router';
import { RenewalService } from '../../renewal.service';
import { LicenseObject } from '../../models/license_model';
import { combineLatest, Subject, take, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { AppService } from 'src/app/app.service';
import { openHtmlInNewWindow } from 'src/app/shared/utils/helper';
import { DialogFormComponent } from 'src/app/shared/components/dialog-form/dialog-form.component';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';

@Component({
  selector: 'app-renewal',
  templateUrl: './renewal.component.html',
  styleUrls: ['./renewal.component.scss']
})
export class RenewalComponent implements OnInit, OnChanges, OnDestroy {
  baseUrl: string = "licenses/renewal";
  url: string = "licenses/renewal";
  ts: string = "";
  @Input() license: LicenseObject | undefined = undefined;
  queryParams: { [key: string]: string } = {};
  licenseType: string = "";
  inlineFilters: string[] = ["start_date", "end_date"];
  destroy$: Subject<boolean> = new Subject();
  canPrint: boolean = false;
  selectedItems: RenewalObject[] = [];
  canApproveOnlineCertificate: boolean = false;
  constructor(private authService: AuthService, private notify: NotifyService, public dialog: MatDialog,
    private renewalService: RenewalService, private ar: ActivatedRoute, private router: Router,
    private appService: AppService) {
    this.licenseType = ar.snapshot.params['type'];

  }
  ngOnInit(): void {
    combineLatest([
      this.ar.queryParams,
      this.ar.paramMap
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe(([queryParams, params]) => {
      this.queryParams = queryParams;
      this.licenseType = params.get('type') ?? '';
      if (this.license) {
        this.licenseType = this.license.type
      }
      this.queryParams = queryParams;

      this.setUrl();

      this.canPrint = this.authService.currentUser?.permissions.includes(`Print_Renewal_Certificates_${this.licenseType}`) ?? false;
      this.checkCanApproveOnlineCertificate();

    });
  }

  private checkCanApproveOnlineCertificate() {
    this.canApproveOnlineCertificate = false;
    this.appService.appSettings.pipe(take(1)).subscribe(data => {
      const stages = data?.licenseTypes[this.licenseType]?.renewalStages;
      if (!stages) {
        return;
      }
      for (let i = 0; i < Object.values(stages).length; i++) {
        const stage = Object.values(stages)[i];
        //get the stage that has onlineCertificatePrintable set to true and check if the user has the permission required for that stage
        if (stage.onlineCertificatePrintable && this.authService.currentUser?.permissions.includes(stage.permission)) {
          this.canApproveOnlineCertificate = true;
          break;
        }
      }
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.setUrl();
  }

  setUrl() {
    let queryParams = "?license_type=" + this.licenseType;
    Object.keys(this.queryParams).forEach(key => {
      queryParams += queryParams === "" ? "?" : "&";
      queryParams += `${key}=${this.queryParams[key]}`;
    });
    if (this.license) {
      this.url = this.baseUrl + "/license/" + this.license.uuid + queryParams;
    }
    else {
      this.url = this.baseUrl + queryParams;
    }
  }

  getActions = (object: RenewalObject): DataActionsButton[] => {

    const actions: DataActionsButton[] = [
      { label: "Edit", type: "link", link: `licenses/renewal-form/`, linkProp: 'uuid' },
      { label: "Delete", type: "button", onClick: (object: RenewalObject) => this.delete(object) }
    ];
    if (!this.license) {
      actions.unshift(
        { label: "View license", type: "link", link: `licenses/license-details/`, linkProp: 'license_uuid' }
      )
    }


    return actions;
  }
  delete(object: RenewalObject) {
    this.renewalService.delete(object.uuid).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
        this.updateTimestamp();
      },
      error: error => { }
    })
  }

  updateTimestamp() {
    this.ts = getToday("timestamp_string");
  }

  update(object: RenewalObject, data: { [key: string]: string }) {
    if (!window.confirm('Are you sure you want to update this entry? ')) {
      return;
    }
    this.renewalService.update(object.uuid, data).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
        this.updateTimestamp();
      },
      error: error => { }
    })
  }

  onLicenseTypeChange(selectedValue: string) {
    this.router.navigate(['licenses/renewals'], { queryParams: { license_type: selectedValue } });
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
    paramsObject['license_type'] = this.licenseType;


    this.router.navigate(['licenses/renewals'], { queryParams: paramsObject });

  }

  selectionChanged = (selected: RenewalObject[]) => {
    this.selectedItems = selected;
  }

  private itemsCanBePrinted(items: RenewalObject[]) { }

  setPrintTemplates() {
    const fields = [
      {
        label: "Print Template",
        name: "print_template",
        hint: "The template to use for printing by admins",
        options: [],
        type: "api",
        value: "",
        required: true,
        api_url: "print-queue/templates",
        apiKeyProperty: "template_name",
        apiLabelProperty: "template_name",
        apiType: "select"
      }
    ];
    this.dialog.open(DialogFormComponent, {
      data: {
        fields: fields, title: `Select the templates. This will apply to all ${this.selectedItems.length} selected item(s)`,
        formType: "filter"
      },
      height: '90vh',
      width: '90vw'
    }).afterClosed().subscribe((data: IFormGenerator[]) => {
      //get an object of the name and value of the fields
      if (!data) {
        this.notify.failNotification("Please provide the required data");
        return;
      }
      const renewalData = this.selectedItems.map(item => {
        return {
          uuid: item.uuid,
          print_template: data.find(field => field.name === "print_template")?.value,
          license_type: item.license_type,
          license_number: item.license_number,
          status: item.status
        }
      });
      this.renewalService.updateBulkRenewals(renewalData, "").subscribe({
        next: (res) => {
          this.notify.successNotification("Items added to print queue");
          this.updateTimestamp();
          this.selectedItems = [];
        }
      });
    })
  }

  updatePrintQueue = (state: number) => {
    if (!this.selectedItems.length) {
      alert("Please select at least one item to add to the print queue");
      return;
    }
    const message = state === 1 ? "Add to print queue" : "Remove from print queue";
    if (!window.confirm(`Are you sure you want to ${message} for the selected items?`)) {
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
          this.selectedItems = [];
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
            this.selectedItems = [];
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

  /**
   * Opens a dialog to approve online/temporary certificates for the selected items.
   * This will allow them to generate and print certificates online for the selected renewals.
   * Please provide the following data:
   * - Online Certificate Template: The template to use for online certificate printing by practitioners
   * - Online Certificate Valid Period Start Date: The start date for the online certificate
   * - Online Certificate Valid Period End Date: The end date for the online certificate
   * Please note that this will override any existing online certificate templates set for the selected renewals.
   */
  approveOnlineCerficates() {
    const fields = [

      {
        label: "Online Certificate Template",
        name: "online_print_template",
        hint: "The template to use for online certificate printing by practitioners",
        options: [],
        type: "api",
        value: "",
        required: false,
        api_url: "print-queue/templates",
        apiKeyProperty: "template_name",
        apiLabelProperty: "template_name",
        apiType: "select"
      },
      {
        label: "Online Certificate Valid Period Start Date",
        name: "online_certificate_start_date",
        hint: "The start date for the online certificate",
        options: [],
        type: "date",
        value: "",
        required: true,
        api_url: "",
        apiKeyProperty: "",
        apiLabelProperty: "",
        apiType: ""
      },
      {
        label: "Online Certificate Valid Period End Date",
        name: "online_certificate_end_date",
        hint: "The end date for the online certificate",
        options: [],
        type: "date",
        value: "",
        required: true,
        api_url: "",
        apiKeyProperty: "",
        apiLabelProperty: "",
        apiType: ""
      },
    ];
    this.dialog.open(DialogFormComponent, {
      data: {
        fields: fields, title: `Approve online/temporary certificates for ${this.selectedItems.length} selected item(s). This will allow them to generate and print certificates online for the selected renewals. Please provide the following data.
        Please note that this will override any existing online certificate templates and valid period set for the selected renewals.`,
        formType: "filter"
      },
      height: '90vh',
      width: '90vw'
    }).afterClosed().subscribe((data: IFormGenerator[]) => {
      //get an object of the name and value of the fields
      if (!data) {
        this.notify.failNotification("Please provide the required data");
        return;
      }
      const renewalData = this.selectedItems.map(item => {
        return {
          uuid: item.uuid,
          online_print_template: data.find(field => field.name === "online_print_template")?.value,
          online_certificate_start_date: data.find(field => field.name === "online_certificate_start_date")?.value,
          online_certificate_end_date: data.find(field => field.name === "online_certificate_end_date")?.value,
          approve_online_certificate: "Yes",
          license_type: item.license_type,
          license_number: item.license_number,
          status: item.status
        }
      });
      if (!window.confirm("Are you sure you want to approve online/temporary certificates for the selected renewals?")) {
        return;
      }
      this.renewalService.updateBulkRenewals(renewalData, "").subscribe({
        next: (res) => {
          this.notify.successNotification(res.message);
          this.updateTimestamp();
          this.selectedItems = [];
        }
      });
    })
  }

  revokeOnlineCerficates() {
    if (!window.confirm("Are you sure you want to revoke online/temporary certificates for the selected renewals?")) {
      return;
    }
    const renewalData = this.selectedItems.map(item => {
      return {
        uuid: item.uuid,
        online_print_template: null,
        online_certificate_start_date: null,
        online_certificate_end_date: null,
        approve_online_certificate: "No",
        license_type: item.license_type,
        license_number: item.license_number,
        status: item.status
      }
    });

    this.renewalService.updateBulkRenewals(renewalData, "").subscribe({
      next: (res) => {
        this.notify.successNotification(res.message);
        this.updateTimestamp();
        this.selectedItems = [];
      }
    });
  }
}
