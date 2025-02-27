import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { FormGeneratorComponent } from 'src/app/shared/components/form-generator/form-generator.component';
import { FormGeneratorComponentInterface } from 'src/app/shared/types/FormGeneratorComponentInterface';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.scss']
})
export class SendEmailComponent implements OnInit, FormGeneratorComponentInterface {
  title: string = "Send Email";
  formUrl: string = "email/send";
  existingUrl: string = "cpd/details";
  fields: IFormGenerator[] = [
    {
      label: "To",
      name: "receiver",
      hint: "Separate with semicolons",
      options: [],
      type: "text",
      value: "",
      required: true,
      api_url: "",
      apiKeyProperty: "",
      apiLabelProperty: "",
    },
    {
      label: "Sender",
      name: "sender",
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
      label: "CC",
      name: "cc",
      hint: "",
      options: [],
      type: "text",
      value: "",
      required: false,
      api_url: "",
      apiKeyProperty: "",
      apiLabelProperty: "",
    },
    {
      label: "BCC",
      name: "bcc",
      hint: "",
      options: [],
      type: "text",
      value: "",
      required: false,
      api_url: "",
      apiKeyProperty: "",
      apiLabelProperty: "",
    },
    {
      label: "Subject",
      name: "subject",
      hint: "",
      options: [],
      type: "text",
      value: "",
      required: true
    },
    {
      label: "Message",
      name: "message",
      hint: "",
      options: [],
      type: "html",
      value: "",
      required: true
    },
    {
      label: "Attachment",
      name: "attachment",
      hint: "",
      options: [],
      type: "file",
      value: "",
      required: true
    }


  ];
  @ViewChild('form') formGenerator!: FormGeneratorComponent;
  constructor(private ar: ActivatedRoute, private router: Router) {

  }

  extraFormData?: { key: string; value: any; }[] | undefined;


  ngOnInit(): void {

  }

  formSubmitted(args: boolean) {
    if (args) {
      this.formGenerator.resetForm()
    }
  }
}
