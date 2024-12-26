import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { FormGeneratorComponentInterface } from 'src/app/shared/types/FormGeneratorComponentInterface';

@Component({
  selector: 'app-providers-form',
  templateUrl: './providers-form.component.html',
  styleUrls: ['./providers-form.component.scss']
})
export class ProvidersFormComponent implements OnInit, FormGeneratorComponentInterface {
  id?: string;
  constructor(private ar: ActivatedRoute, private router: Router) {
    this.id = this.ar.snapshot.params['id'];
  }

  formUrl: string = "cpd/providers";
  existingUrl: string = "cpd/providers";
  fields: IFormGenerator[] = [
    {
      label: "Name",
      name: "name",
      hint: "",
      options: [],
      type: "text",
      value: "",
      required: true
    },
    {
      label: "Phone",
      name: "phone",
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
      label: "Location",
      name: "location",
      hint: "",
      options: [],
      type: "text",
      value: "",
      required: true,
      api_url: "",
      apiKeyProperty: "",
      apiLabelProperty: "",
    }
  ];
  extraFormData: { key: string, value: any }[] = [];

  formSubmitted(args: boolean): void {
    if (args) {
      this.router.navigate(['/cpd/providers'])
    }
  }
  ngOnInit(): void {
    if (this.id) {
      this.existingUrl = `cpd/providers/${this.id}`;
      this.formUrl = `cpd/providers/${this.id}`;
      this.extraFormData = [{ key: "id", value: this.id }]
    }

  }
}
