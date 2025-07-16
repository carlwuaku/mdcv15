import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGeneratorComponentInterface } from '../../types/FormGeneratorComponentInterface';
import { IFormGenerator } from '../form-generator/form-generator-interface';
import { FormGeneratorComponent } from '../form-generator/form-generator.component';

/**
 * Send Email Component
 * This component is responsible for sending emails.
 * It uses the FormGeneratorComponent to generate and submit a form for sending emails.
 * The form includes fields for the recipient, sender, CC, BCC, subject, message, and attachment.
 * The component also handles the form submission and resets the form after successful submission.
 * Data may be passed from the parent component to pre-fill the form fields.
 */
@Component({
  selector: 'app-email-form',
  templateUrl: './email-form.component.html',
  styleUrls: ['./email-form.component.scss']
})
export class EmailFormComponent implements OnInit, OnChanges, FormGeneratorComponentInterface {
  @Input() formUrl: string = "email/send";
  existingUrl: string = "";
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
      required: false
    }


  ];
  @ViewChild('form') formGenerator!: FormGeneratorComponent;
  @Input() data: Record<string, any> = {};
  @Output() onSubmit: EventEmitter<IFormGenerator[]> = new EventEmitter();
  constructor(private ar: ActivatedRoute, private router: Router) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    // if (changes['data']?.currentValue !== changes['data']?.previousValue) {
    this.setExistingData(this.data);
    // }
  }

  extraFormData?: { key: string; value: any; }[] | undefined;


  ngOnInit(): void {
    this.setExistingData(this.data);
  }


  setExistingData(data: Record<string, any>) {
    const formNames = this.fields.map((field) => field.name);

    if (data && Object.keys(data).length > 0) {
      formNames.forEach((name) => {
        if (data[name]) {
          const field = this.fields.find((field) => field.name === name);
          if (field) {
            field.value = data[name];
          }
        }
      }
      );
    }
  }

  formSubmitted(args: boolean) {

    if (args) {
      this.formGenerator.resetForm();
      this.onSubmit.emit(this.fields);
    }
  }

}
