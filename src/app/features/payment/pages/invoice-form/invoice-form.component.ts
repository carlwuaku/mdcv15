import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { FormGeneratorComponentInterface } from 'src/app/shared/types/FormGeneratorComponentInterface';

@Component({
  selector: 'app-invoice-form',
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.scss']
})
export class InvoiceFormComponent implements OnInit, FormGeneratorComponentInterface {
  title: string = "Create a new invoice";
  formUrl: string = "payment/invoices";
  existingUrl: string = "payment/invoices";
  fields: IFormGenerator[] = [

    {
      label: "License/registration number",
      name: "unique_id",
      hint: "",
      options: [],
      type: "api",
      value: "",
      required: true,
      api_url: "licenses/details",
      apiKeyProperty: "license_number",
      apiLabelProperty: "name,license_number",
      apiType: "search",
    },
    {
      label: "Payment type",
      name: "purpose",
      hint: "",
      options: [],
      type: "text",
      value: "",
      required: true
    },
    {
      label: "Rate",
      name: "rate",
      hint: "",
      options: [],
      type: "text",
      value: "",
      required: true
    },
    {
      label: "Currency",
      name: "currency",
      hint: "",
      options: [
        { value: "GHS", key: "Ghana Cedis" },
        { value: "$", key: "Dollars" },
        { value: "GBP", key: "Pound Sterling" },
      ],
      type: "select",
      value: "",
      required: true
    }


  ];
  id?: string = undefined;
  constructor(private ar: ActivatedRoute, private router: Router) {

  }

  extraFormData?: { key: string; value: any; }[] | undefined;


  ngOnInit(): void {
    this.id = this.ar.snapshot.params['id'];
    if (this.id) {
      this.title = "Edit payment fee";
      this.existingUrl = `payment/fees/${this.id}`;
      this.formUrl = `payment/fees/${this.id}`;
    }
  }

  formSubmitted(args: boolean) {
    if (args) {
      this.router.navigate(['/payment/fees']);
    }
  }


}
