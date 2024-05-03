import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.scss']
})
export class TemplateFormComponent {
  title: string = "Add a new practitioner";
  formUrl: string = "practitioners/details";
  existingUrl: string = "practitioners/details";
  fields: IFormGenerator[] = [
    {
      label: "Template Name",
      name: "form_name",
      hint: "",
      options: [],
      type: "text",
      value: "",
      required: true
    },
    {
      label: "Guidelines",
      name: "guidelines",
      hint: "",
      options: [],
      type: "html",
      value: "",
      required: false,
      api_url: "",
      apiKeyProperty: "",
      apiLabelProperty: "",
    },
    {
      label: "Header",
      name: "header",
      hint: "",
      options: [
      ],
      type: "html",
      value: "",
      required: false,
      api_url: "",
      apiKeyProperty: "",
      apiLabelProperty: "",
    },
    {
      label: "Form Fields",
      name: "data",
      hint: "",
      options: [
      ],
      type: "json",
      value: "",
      required: true,
      api_url: "",
      apiKeyProperty: "",
      apiLabelProperty: "",
    },
    {
      label: "Form Footer",
      name: "footer",
      hint: "",
      options: [
      ],
      type: "html",
      value: "",
      required: false,
      api_url: "",
      apiKeyProperty: "",
      apiLabelProperty: "",
    },

    {
      label: "Open From",
      name: "open_date",
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
      label: "Closes On",
      name: "close_date",
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
      label: "Email Template After Submitting",
      name: "on_submit_email",
      hint: "",
      options: [
      ],
      type: "html",
      value: "",
      required: false,
      api_url: "",
      apiKeyProperty: "",
      apiLabelProperty: "",
    },
    {
      label: "Message to display after submitting",
      name: "on_submit_message",
      hint: "",
      options: [],
      type: "html",
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
      this.title = "Edit application template";
      this.existingUrl = `applications/templates/${this.id}`;
      this.formUrl = `applications/templates/${this.id}`;
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
