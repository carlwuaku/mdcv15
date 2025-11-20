import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IFormGenerator, reorderFormFields } from 'src/app/shared/components/form-generator/form-generator-interface';
import { goBackHome } from 'src/app/shared/utils/helper';
import { LicensesService } from '../../licenses.service';
import { FormGeneratorComponentInterface } from 'src/app/shared/types/FormGeneratorComponentInterface';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { Subject, takeUntil, combineLatest } from 'rxjs';

@Component({
  selector: 'app-license-form',
  templateUrl: './license-form.component.html',
  styleUrls: ['./license-form.component.scss']
})
export class LicenseFormComponent implements OnInit, FormGeneratorComponentInterface, OnDestroy {
  public action: string | undefined = undefined;
  public id: string | undefined = undefined;
  public licenseType: string | undefined = undefined;
  public title: string = "";
  public existingUrl: string = "";
  public fields: (IFormGenerator | IFormGenerator[])[] = [];
  public extraFormData: { key: string, value: any }[] = []
  public formUrl: string = "licenses/details"
  public loaded: boolean = false;
  destroy$: Subject<boolean> = new Subject();
  queryParams: { [key: string]: string } = {};
  preferredFieldsOrder = [
    "practitioner_type",
    "picture",
    "first_name",
    "last_name",
    "middle_name",
    "name",
    "category",
    "register_type",
    "license_number",
    "index_number",
    "registration_number",
    "sex",
    "status",
    "date_of_birth",
    "business_type",
    "maiden_name",
    "title",
    "nationality",
    "region",
    "district",
    "email",
    "phone",
    "training_institution",
    "qualification",
    "qualification_at_registration",
    "registration_date",
    "date_of_graduation",
    "postal_address",
    "premises_address",
    "town",
    "suburb",
    "coordinates",
    "application_code"

  ];
  constructor(private service: LicensesService, private ar: ActivatedRoute, private router: Router, private notify: NotifyService) {

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
      this.queryParams = queryParams;
      this.licenseType = params.get('type') ?? undefined;
      this.id = params.get('id') ?? undefined;
      this.action = params.get('action') ?? undefined;
      if (this.action === "create") {
        if (!this.licenseType) {
          goBackHome("No license type defined");
          return;
        }
        this.title = `Add new license (${this.licenseType})`;
      }
      else if (this.action === "update") {
        if (!this.id) {
          goBackHome("No license id defined");
          return;
        }
        this.title = `Edit license details`;
        this.existingUrl = `licenses/details/${this.id}`;
        this.formUrl = `licenses/details/${this.id}`;

      }
      if (this.licenseType) {
        this.loaded = false;
        this.getFormFields(this.licenseType);
        this.extraFormData = [{ key: "type", value: this.licenseType }]
      }
      if (this.id) {
        this.extraFormData.push({ key: "uuid", value: this.id })
      }
    });
  }

  formSubmitted(args: boolean) {
    if (args) {
      if (this.id) {
        this.router.navigate(['/licenses/license-details/' + this.id]);
      }
      else {
        window.history.back();
      }
    }
    else {
      this.notify.failNotification("Failed to update")
    }
  }

  getFormFields(type: string) {
    this.service.getLicenseFormConfig(type).subscribe(
      {
        next: data => {
          this.fields = reorderFormFields(data.data, this.preferredFieldsOrder);
          this.loaded = true;
        },
        error: error => {
          console.error(error);
          this.fields = [];
          this.loaded = true;
        }
      }
    )
  }

}
