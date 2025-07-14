import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { HttpService } from 'src/app/core/services/http/http.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';
import { getThisYear, getToday } from 'src/app/shared/utils/dates';
import { combineLatest, Subject, take, takeUntil } from 'rxjs';
import { RenewalObject } from '../renewal.model';
import { LicenseObject } from '../../../models/license_model';
import { RenewalService } from '../../../renewal.service';

@Component({
  selector: 'app-renewal-form',
  templateUrl: './renewal-form.component.html',
  styleUrls: ['./renewal-form.component.scss']
})
export class RenewalFormComponent implements OnInit, OnDestroy {
  title: string = "Renew a license";
  formUrl: string = "licenses/renewal";
  existingUrl: string = "licenses/renewal";

  extraFormData: { key: string, value: any }[] = [];


  id: string | null = null;
  object: LicenseObject | null = null;
  loading: boolean = false;
  errorLoadingData: boolean = false;
  date: string = getToday();
  licenseUuid: string | "" = "";
  selectedLicense: LicenseObject | null = null;
  fields: IFormGenerator[] = [];
  fieldsToRetain: string[] = ["license_uuid"];

  licenseSearchBaseUrl: string = "licenses/details";
  licenseSearchUrl: string = `licenses/details?renewalYear=${this.date}`;
  ts: string = "";
  existingRenewal: any | null = null;
  licenseType: string | null = null;
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private ar: ActivatedRoute, private router: Router,
    private dbService: HttpService, private notify: NotifyService, private renewalService: RenewalService) {

  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit(): void {
    combineLatest([
      this.ar.queryParams,
      this.ar.paramMap
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe(([queryParams, params]) => {
      this.licenseType = queryParams['license_type'] ?? null;
      this.id = params.get('id');

      //get the query parameters named registration_number
      this.licenseUuid = queryParams['license_uuid'] || "";
      if (this.licenseUuid) {
        this.getLicense(this.licenseUuid)
      }
      else if (this.id) {
        this.title = "Edit Renewal";
        this.existingUrl = `licenses/renewal/${this.id}`;
        this.formUrl = `licenses/renewal/${this.id}`;
        this.extraFormData = [{ key: "uuid", value: this.id }]
        this.getRenewal();
      }
    });
    this.licenseSearchUrl = `licenses/details?renewalDate=${this.date}&type=${this.licenseType}`;
  }

  getFormFields(type: string) {
    this.loading = true;
    this.renewalService.getRenewalFormFields(type).subscribe({
      next: data => {
        this.fields = data.data;
        this.setFormFields(this.selectedLicense);
        this.loading = false;
      },
      error: error => {
        this.notify.failNotification("Error loading form fields. Please try again");
        this.loading = false;
      }
    })
  }

  updateUrlYear() {
    this.licenseSearchUrl = `licenses/details?renewalDate=${this.date}`;
    //also update the form year field
    const yearField = this.fields.find((item) => item.name === "year");
    if (yearField) { yearField.value = this.date }
  }




  getActions = (license: LicenseObject): DataActionsButton[] => {

    const actions: DataActionsButton[] = [

    ];

    if (!license.last_renewal_uuid) {
      actions.push(
        { label: "Renew", type: "button", onClick: (license: LicenseObject) => this.selectForRenewal(license) }
      )
    }
    else {
      actions.push(
        { label: "Edit", type: "link", link: `licenses/renewal-form/`, linkProp: 'last_renewal_uuid' },
        { label: "Undo Renewal", type: "button", onClick: (license: LicenseObject) => this.undoRenewal(license) },
      )
    }
    return actions;
  }

  getLicense(id: string) {
    this.dbService.get<LicenseObject>(this.licenseSearchBaseUrl + "/" + id)
      .pipe(take(1))
      .subscribe(data => {
        this.selectedLicense = data;
        this.getFormFields(data['type']);

      })
  }

  getRenewal() {
    this.dbService.get<{ data: any }>(this.formUrl)
      .pipe(take(1))
      .subscribe(data => {
        this.selectedLicense = {} as LicenseObject;
        this.selectedLicense['type'] = data.data.license_type;
        this.selectedLicense['uuid'] = data.data.license_uuid;
        this.selectedLicense['name'] = data.data.name;
        this.selectedLicense['postal_address'] = data.data.postal_address;
        this.selectedLicense['district'] = data.data.district;
        this.selectedLicense['region'] = data.data.region;
        this.selectedLicense['phone'] = data.data.phone;
        this.selectedLicense['email'] = data.data.email;
        this.selectedLicense['license_number'] = data.data.license_number;
        this.existingRenewal = data.data;
        this.getFormFields(data.data.license_type);

      })
  }

  selectForRenewal(license: any) {
    this.selectedLicense = license;
    this.getFormFields(license['type']);

  }

  setFormFields(license: any) {
    this.fields.map(field => {
      if (field.name !== "status") {
        field.value = license[field.name];
      }
    });
    if (this.existingRenewal) {
      Object.keys(this.existingRenewal).forEach(key => {
        const field = this.fields.find((item) => item.name === key);
        if (field) { field.value = this.existingRenewal[key] }
      }
      )
    }

    this.extraFormData = [
      { key: "license_uuid", value: license.uuid },
      { key: "license_type", value: license.type },


    ]
  }

  undoRenewal(object: LicenseObject) {
    this.renewalService.delete(object.last_renewal_uuid!).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
        this.updateTimestamp();
      },
      error: error => { }
    })
  }


  formSubmitted(args: boolean) {
    if (args) {
      this.selectedLicense = null;
      this.router.navigate(['/licenses/renewal-form'])
    }
  }

  updateTimestamp() {
    this.ts = getToday("timestamp_string");
  }

  onDateChanged(date: string) {
    this.date = date;
    this.updateUrlYear();
  }
}
