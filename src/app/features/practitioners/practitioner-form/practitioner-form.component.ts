import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';

@Component({
  selector: 'app-practitioner-form',
  templateUrl: './practitioner-form.component.html',
  styleUrls: ['./practitioner-form.component.scss']
})
export class PractitionerFormComponent {
  title: string = "Add a new practitioner";
  formUrl: string = "practitioners/details";
  existingUrl: string = "practitioners/details";
  fields: IFormGenerator[] = [
    {
      label: "Category",
      name: "category",
      hint: "",
      options: [
        { key: "Medical", value: "Medical" },
        { key: "Dental", value: "Dental" },
      ],
      type: "select",
      value: "",
      required: true
    },
    {
      label: "Register Type",
      name: "register_type",
      hint: "",
      options: [
        { key: "Permanent", value: "Permanent" },
        { key: "Provisional", value: "Provisional" },
        { key: "Temporary", value: "Temporary" }
      ],
      type: "select",
      value: "",
      required: true,
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
      label: "Date of Birth",
      name: "date_of_birth",
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
    },
    {
      label: "Sex",
      name: "sex",
      hint: "",
      options: [
        { key: "Male", value: "Male" },
        { key: "Female", value: "Female" }
      ],
      type: "select",
      value: "",
      required: true,
      api_url: "",
      apiKeyProperty: "",
      apiLabelProperty: "",
    },
    {
      label: "Status",
      name: "status",
      hint: "",
      options: [
        { key: "Alive", value: "Alive" },
        { key: "Deceased", value: "Deceased" }
      ],
      type: "select",
      value: "",
      required: true,
      api_url: "",
      apiKeyProperty: "",
      apiLabelProperty: "",
    },
    {
      label: "Date of Provisional Registration",
      name: "year_of_provisional",
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
      label: "Maiden Name",
      name: "maiden_name",
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
      label: "Nationality",
      name: "nationality",
      hint: "",
      options: [
        {key:"Ghanaian",value:"Ghanaian"},
        {key:"Nigerian",value:"Nigerian"},
        {key:"U.S.A",value:"U.S.A"},
        {key:"Togolese",value:"Togolose"},
      ],
      type: "text",
      value: "",
      required: true,
      api_url: "",
      apiKeyProperty: "",
      apiLabelProperty: "",
    },
    {
      label: "Qualification Date",
      name: "qualification_date",
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
      onChange: (value:string) => {
        const districtField = this.fields.find((item) =>  item.name === "district");
        if(districtField) {districtField.api_url = `regions/districts/${value}`}
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
      label: "Email",
      name: "email",
      hint: "",
      options: [
      ],
      type: "email",
      value: "",
      required: false,
      api_url: "",
      apiKeyProperty: "",
      apiLabelProperty: "",
    },
    {
      label: "Phone Number",
      name: "phone",
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
      label: "Postal Address",
      name: "postal_address",
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
      onChange: (value:string) => {
        const subspecialtiesField = this.fields.find((item) =>  item.name === "subspecialty");
        if(subspecialtiesField) {subspecialtiesField.api_url = `specialties/subspecialties?specialty=${value}`}
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
      label: "Date of Permanent Registration",
      name: "year_of_permanent",
      hint: "",
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
      label: "Provisional Registration Number",
      name: "provisional_number",
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
  id: string;
  extraFormData: { key: string, value: any }[] = []
  constructor(ar: ActivatedRoute, private router: Router) {
    this.id = ar.snapshot.params['id'];
    if (this.id) {
      this.title = "Edit practitioner";
      this.existingUrl = `practitioners/details/${this.id}`;
      this.formUrl = `practitioners/details/${this.id}`;
      this.extraFormData = [{ key: "uuid", value: this.id }]
    }
  }

  ngOnInit(): void {
  }

  formSubmitted(args: boolean) {
    if (args) {
      this.router.navigate(['/practitioners'])
    }
  }
}
