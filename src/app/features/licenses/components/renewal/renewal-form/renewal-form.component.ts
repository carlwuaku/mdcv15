import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { HttpService } from 'src/app/core/services/http/http.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';
import { getThisYear, getToday } from 'src/app/shared/utils/dates';
import { take } from 'rxjs';
import { RenewalObject } from '../renewal.model';
import { LicenseObject } from '../../../models/license_model';
import { RenewalService } from '../../../renewal.service';

@Component({
  selector: 'app-renewal-form',
  templateUrl: './renewal-form.component.html',
  styleUrls: ['./renewal-form.component.scss']
})
export class RenewalFormComponent {
  title: string = "Add a new practitioner";
  formUrl: string = "practitioners/renewal";
  existingUrl: string = "practitioners/renewal";

  extraFormData: { key: string, value: any }[] = [];


  id: string | null = null;
  object: LicenseObject | null = null;
  loading: boolean = false;
  errorLoadingData: boolean = false;
  date: string = getToday();
  practitionerUuid: string | "" = "";
  selectedPractitioner: LicenseObject | null = null;
  fields: IFormGenerator[] = [
    {
      label: "Registration Number",
      name: "registration_number",
      hint: "",
      options: [
      ],
      type: "text",
      value: "",
      required: true,
      api_url: "",
      apiKeyProperty: "",
      apiLabelProperty: "",
      showOnly: true
    },
    {
      label: "Start Date",
      name: "year",
      hint: "",
      options: [
      ],
      type: "date",
      value: "",
      required: true,
      api_url: "",
      apiKeyProperty: "",
      apiLabelProperty: "",
    },
    {
      label: "Expiry Date",
      name: "expiry",
      hint: "If blank, one will be auto-generated",
      options: [
      ],
      type: "date",
      value: "",
      required: false,
      api_url: "",
      apiKeyProperty: "",
      apiLabelProperty: "",
    },

    {
      label: "First Name",
      name: "first_name",
      hint: "",
      options: [
      ],
      type: "text",
      value: "",
      required: true,
      api_url: "",
      apiKeyProperty: "",
      apiLabelProperty: "",
    },
    {
      label: "Last Name",
      name: "last_name",
      hint: "",
      options: [
      ],
      type: "text",
      value: "",
      required: true,
      api_url: "",
      apiKeyProperty: "",
      apiLabelProperty: "",
    },
    {
      label: "Middle Name",
      name: "middle_name",
      hint: "",
      options: [
      ],
      type: "text",
      value: "",
      required: false,
      api_url: "",
      apiKeyProperty: "",
      apiLabelProperty: "",
    },

    {
      label: "Picture",
      name: "picture",
      hint: "",
      options: [
      ],
      type: "picture",
      value: "",
      required: false,
      api_url: "",
      apiKeyProperty: "",
      apiLabelProperty: "",
    },


    {
      label: "Status",
      name: "status",
      hint: "",
      options: [
        { key: "Pending Payment", value: "Pending Payment" },
        { key: "Pending Approval", value: "Pending Approval" },
        { key: "Approved", value: "Approved" }
      ],
      type: "select",
      value: "",
      required: true,
      api_url: "",
      apiKeyProperty: "",
      apiLabelProperty: "",
    },
    {
      label: "Title",
      name: "title",
      hint: "",
      options: [
        { key: "Mr", value: "Mr" },
        { key: "Mrs", value: "Mrs" },
        { key: "Miss", value: "Miss" },
        { key: "Prof", value: "Prof" },
        { key: "Dr", value: "Dr" },
        { key: "Rev", value: "Rev" }
      ],
      type: "select",
      value: "",
      required: true,
      api_url: "",
      apiKeyProperty: "",
      apiLabelProperty: "",
    },

    {
      label: "Place of Work",
      name: "place_of_work",
      hint: "",
      options: [
      ],
      type: "text",
      value: "",
      required: false,
      api_url: "",
      apiKeyProperty: "",
      apiLabelProperty: "",
    },
    {
      label: "Institution Type",
      name: "institution_type",
      hint: "",
      options: [
      ],
      type: "api",
      value: "",
      required: false,
      api_url: "admin/settings/Doctors.work_institution_types",
      apiKeyProperty: "name",
      apiLabelProperty: "name",
      apiType: "datalist",
    },
    {
      label: "Region",
      name: "region",
      hint: "",
      options: [
      ],
      type: "api",
      value: "",
      required: false,
      api_url: "regions/regions",
      apiKeyProperty: "name",
      apiLabelProperty: "name",
      apiType: "select",
      onChange: (value: string) => {
        const districtField = this.fields.find((item) => item.name === "district");
        if (districtField) { districtField.api_url = `regions/districts/${value}` }
      }
    },
    {
      label: "District",
      name: "district",
      hint: "",
      options: [
      ],
      type: "api",
      value: "",
      required: false,
      api_url: "regions/districts",
      apiKeyProperty: "district",
      apiLabelProperty: "district",
      apiType: "select",
    },

    {
      label: "Specialty",
      name: "specialty",
      hint: "",
      options: [
      ],
      type: "api",
      value: "",
      required: false,
      api_url: "specialties/specialties",
      apiKeyProperty: "name",
      apiLabelProperty: "name",
      apiType: "select",
      onChange: (value: string) => {
        const subspecialtiesField = this.fields.find((item) => item.name === "subspecialty");
        if (subspecialtiesField) { subspecialtiesField.api_url = `specialties/subspecialties?specialty=${value}` }
      }
    },
    {
      label: "Subspecialty",
      name: "subspecialty",
      hint: "",
      options: [
      ],
      type: "api",
      value: "",
      required: false,
      api_url: "specialties/subspecialties",
      apiKeyProperty: "subspecialty",
      apiLabelProperty: "subspecialty",
      apiType: "select"
    },
    {
      label: "Membership Type",
      name: "college_membership",
      hint: "",
      options: [
        { key: "", value: "None" },
        { key: "Member", value: "Member" },
        { key: "Fellow", value: "Fellow" },
      ],
      type: "select",
      value: "",
      required: false,
      api_url: "",
      apiKeyProperty: "",
      apiLabelProperty: "",
    },
  ];
  fieldsToRetain: string[] = ["practitioner_uuid"];

  practitionerSearchBaseUrl: string = "practitioners/details";
  practitionerSearchUrl: string = `practitioners/details?renewalYear=${this.date}`;
  ts: string = "";
  constructor(ar: ActivatedRoute, private router: Router,
    private dbService: HttpService, private notify: NotifyService, private renewalService: RenewalService) {
    this.id = ar.snapshot.params['id'];
    if (this.id) {
      this.title = "Edit Renewal";
      this.existingUrl = `practitioners/renewal/${this.id}`;
      this.formUrl = `practitioners/renewal/${this.id}`;
      this.extraFormData = [{ key: "uuid", value: this.id }]
    }
    //get the query parameters named registration_number
    this.practitionerUuid = ar.snapshot.queryParamMap.get('practitioner_uuid') || "";
    if (this.practitionerUuid) {
      this.getPractitioner()
    }
  }

  ngOnInit(): void {
    this.practitionerSearchUrl = `practitioners/details?renewalDate=${this.date}`;
  }

  updateUrlYear() {
    this.practitionerSearchUrl = `practitioners/details?renewalDate=${this.date}`;
    //also update the form year field
    const yearField = this.fields.find((item) => item.name === "year");
    if (yearField) { yearField.value = this.date }
  }




  getActions = (practitioner: LicenseObject): DataActionsButton[] => {

    const actions: DataActionsButton[] = [

    ];

    if (practitioner.in_good_standing === "Not In Good Standing") {
      actions.push(
        { label: "Renew", type: "button", onClick: (practitioner: LicenseObject) => this.selectForRenewal(practitioner) }
      )
    }
    else {
      actions.push(
        { label: "Edit", type: "link", link: `practitioners/renewal-form/`, linkProp: 'last_renewal_uuid' },
        { label: "Undo Renewal", type: "button", onClick: (practitioner: LicenseObject) => this.undoRenewal(practitioner) },
      )
    }
    return actions;
  }

  getPractitioner() {
    this.dbService.get<LicenseObject>(this.practitionerSearchBaseUrl + "/" + this.practitionerUuid)
      .pipe(take(1))
      .subscribe(data => {
        this.selectedPractitioner = data;
        this.selectForRenewal(this.selectedPractitioner)
      })
  }

  selectForRenewal(practitioner: any) {
    this.selectedPractitioner = practitioner;
    this.fields.map(field => {
      if (field.name !== "status") {
        field.value = practitioner[field.name];
      }
    })
    this.extraFormData = [
      { key: "practitioner_uuid", value: practitioner.uuid }
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
      this.selectedPractitioner = null;
      this.router.navigate(['/practitioners/renewal-form'])
    }
  }

  updateTimestamp() {
    this.ts = getToday("timestamp_string");
  }
}
