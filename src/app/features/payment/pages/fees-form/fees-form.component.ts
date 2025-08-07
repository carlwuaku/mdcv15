import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { FormGeneratorComponentInterface } from 'src/app/shared/types/FormGeneratorComponentInterface';

@Component({
  selector: 'app-fees-form',
  templateUrl: './fees-form.component.html',
  styleUrls: ['./fees-form.component.scss']
})
export class FeesFormComponent implements OnInit, FormGeneratorComponentInterface {
  title: string = "Add a new payment fee";
  formUrl: string = "payment/fees";
  existingUrl: string = "payment/fees";
  fields: IFormGenerator[] = [

    {
      label: "Name",
      name: "name",
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
      label: "Service code",
      name: "service_code",
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
