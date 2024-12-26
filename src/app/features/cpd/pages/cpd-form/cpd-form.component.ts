import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { FormGeneratorComponentInterface } from 'src/app/shared/types/FormGeneratorComponentInterface';

@Component({
  selector: 'app-cpd-form',
  templateUrl: './cpd-form.component.html',
  styleUrls: ['./cpd-form.component.scss']
})
export class CpdFormComponent implements OnInit, FormGeneratorComponentInterface {
  title: string = "Add a new cpd topic";
  formUrl: string = "cpd/details";
  existingUrl: string = "cpd/details";
  fields: IFormGenerator[] = [
    {
      label: "Select provider",
      name: "provider_id",
      hint: "",
      options: [],
      type: "api",
      value: "",
      required: true,
      api_url: "cpd/providers",
      apiKeyProperty: "id",
      apiLabelProperty: "name",
      apiType: "select",
    },
    {
      label: "Topic",
      name: "topic",
      hint: "",
      options: [],
      type: "text",
      value: "",
      required: true,
      api_url: "",
      apiKeyProperty: "",
      apiLabelProperty: "",
    },
    {
      label: "Date of CPD",
      name: "date",
      hint: "the year of this date will be used to assign credits to participants. If there are multiple dates or the date is unknown, please pick any date within the desired year.",
      options: [],
      type: "date",
      value: "",
      required: true
    },
    {
      label: "Number of credits",
      name: "credits",
      hint: "",
      options: [],
      type: "number",
      value: "",
      required: true
    },
    {
      label: "Category",
      name: "category",
      hint: "",
      options: [
        { value: "1", key: "Category 1" },
        { value: "2", key: "Category 2" },
        { value: "3", key: "Category 3" },
      ],
      type: "select",
      value: "",
      required: true
    },
    {
      label: "Available online",
      name: "online",
      hint: "Choose if the provider can submit the CPD credits online",
      options: [
        { key: "Yes", value: "Yes" },
        { key: "No", value: "No" },
      ],
      type: "select",
      value: "",
      required: true
    },
    {
      label: "Online URL",
      name: "url",
      hint: "Enter the link to the CPD if it is available online",
      options: [],
      type: "text",
      value: "",
      required: false
    },


  ];
  id?: string = undefined;
  constructor(private ar: ActivatedRoute, private router: Router) {

  }

  extraFormData?: { key: string; value: any; }[] | undefined;


  ngOnInit(): void {
    this.id = this.ar.snapshot.params['id'];
    if (this.id) {
      this.title = "Edit CPD topic";
      this.existingUrl = `cpd/details/${this.id}`;
      this.formUrl = `cpd/details/${this.id}`;

    }
  }

  formSubmitted(args: boolean) {
    if (args) {
      this.router.navigate(['/cpd/list_cpd']);
    }
  }

}
