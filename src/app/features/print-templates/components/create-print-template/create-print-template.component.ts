import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { FormGeneratorComponentInterface } from 'src/app/shared/types/FormGeneratorComponentInterface';
import { PrintService } from '../../print.service';

@Component({
  selector: 'app-create-print-template',
  templateUrl: './create-print-template.component.html',
  styleUrls: ['./create-print-template.component.scss']
})
export class CreatePrintTemplateComponent implements OnInit, FormGeneratorComponentInterface {
  title: string = "Add a new template";
  formUrl: string = "print-queue/templates";
  existingUrl: string = "print-queue/templates";
  @ViewChild('fileInput') fileInput!: ElementRef;
  fields: IFormGenerator[] = [
    {
      label: "Template name",
      name: "template_name",
      hint: "",
      options: [],
      type: "text",
      value: "",
      required: true,
      api_url: "",
      apiKeyProperty: "",
      apiLabelProperty: "",
      apiType: "select",
    },
    {
      label: "Template content",
      name: "template_content",
      hint: "",
      options: [],
      type: "html",
      value: "",
      required: true,
      api_url: "",
      apiKeyProperty: "",
      apiLabelProperty: "",
    },
    {
      label: "Allowed roles",
      name: "allowed_roles",
      hint: "",
      options: [],
      type: "api",
      value: [],
      required: true,
      api_url: "admin/roles",
      apiKeyProperty: "role_name",
      apiLabelProperty: "role_name",
      apiType: "select",
      selection_mode: "multiple",
    }


  ];
  id?: string = undefined;
  constructor(private ar: ActivatedRoute, private router: Router,
    private printService: PrintService,
  ) {

  }

  extraFormData?: { key: string; value: any; }[] | undefined;


  ngOnInit(): void {
    this.id = this.ar.snapshot.params['id'];
    if (this.id) {
      this.title = "Edit template";
      this.existingUrl = `print-queue/templates/${this.id}`;
      this.formUrl = `print-queue/templates/${this.id}`;

    }
  }

  formSubmitted(args: boolean) {
    if (args) {
      this.router.navigate(['/print-templates']);
    }
  }

  //we also want the user to be able to upload a docx file
  uploadDocx(event: any) {
    //if there's a content already, warn the user that it will be overwritten
    if (this.fields.find(field => field.name === 'template_content')!.value) {
      if (!window.confirm("This will overwrite the existing content.")) {
        return;
      }
    }
    const file = event.target.files[0];
    this.printService.uploadDocx(file).subscribe((res) => {
      //set the template_content to the response
      this.fields.find(field => field.name === 'template_content')!.value = res.data;
    });
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  setContent(event: any) {
    this.fields.find(field => field.name === 'template_content')!.value = event;
  }

  setRoles(event: any, index: number) {
    this.fields.find(field => field.name === 'allowed_roles')!.value = event;
  }
}
