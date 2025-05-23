import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { HttpService } from 'src/app/core/services/http/http.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { ApplicationTemplatesService } from '../application-templates.service';
import { ApplicationTemplateStageObject } from '../../../shared/types/application-template.model';
import { FileUploadService } from 'src/app/core/services/http/file-upload.service';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.scss']
})
export class TemplateFormComponent implements OnInit {
  title: string = "Add a new practitioner";
  formUrl: string = "applications/templates";
  existingUrl: string = "applications/templates";

  //hold the form fields to pass to the ckeditor and form editor
  fields: (IFormGenerator[] | IFormGenerator)[] = [];
  guidelines: string = "";
  header: string = "";
  footer: string = "";
  on_submit_email: string = "";
  on_submit_message: string = "";
  id: string;
  extraFormData: { key: string, value: any }[] = [];
  generalFormGroup = new FormGroup({
    form_name: new FormControl("", Validators.required),
    picture: new FormControl(""),
    available_externally: new FormControl(""),
    open_date: new FormControl("", Validators.required),
    close_date: new FormControl("", Validators.required)
  });

  guidlinesFormGroup = new FormGroup({
    guidelines: new FormControl("", Validators.required),
  });

  dataFormGroup = new FormGroup({
    data: new FormControl("", Validators.required),
  });
  headerFormGroup = new FormGroup({
    header: new FormControl("", Validators.required),
  });
  footerFormGroup = new FormGroup({
    footer: new FormControl("", Validators.required),
  });
  onSubmitFormGroup = new FormGroup({
    on_submit_message: new FormControl("", Validators.required),
  });

  workflowFormGroup: FormGroup = new FormGroup({
    stages: this.fb.array<ApplicationTemplateStageObject[]>([], Validators.required),
    initialStage: new FormControl("", Validators.required),
    finalStage: new FormControl("", Validators.required)
  });
  loading: boolean = false;
  imageFieldsFiles: Map<string, File> = new Map();


  constructor(ar: ActivatedRoute, private router: Router, private notify: NotifyService, private dbService: HttpService,
    private templateService: ApplicationTemplatesService, @Inject(FormBuilder) private fb: FormBuilder, private fileUploadService: FileUploadService
  ) {
    this.id = ar.snapshot.params['id'];
    if (this.id) {
      this.title = "Edit application template";
      this.existingUrl = `applications/templates/${this.id}`;
      this.formUrl = `applications/templates/${this.id}`;
      this.extraFormData = [{ key: "uuid", value: this.id }]
    }
  }
  ngOnInit(): void {
    if (this.id) {
      this.loadData();
    }
    else {
      //the first name, last name and email fields are added by default, but may be removed
      this.fields = [
        {
          name: "first_name",
          type: "text",
          required: true,
          hint: "Enter your first name",
          label: "First Name",
          options: [],
          value: ""
        },
        {
          name: "last_name",
          type: "text",
          required: true,
          hint: "Enter your last name",
          label: "Last Name",
          options: [],
          value: ""
        },
        {
          name: "email",
          type: "email",
          required: true,
          hint: "Enter your email",
          label: "Email",
          options: [],
          value: ""
        }
      ];
    }
  }

  loadData() {
    this.loading = true;
    this.templateService.getTemplate(this.id).subscribe({
      next: response => {
        this.loading = false;
        this.guidelines = response.data.guidelines;
        this.header = response.data.header;
        this.footer = response.data.footer;
        this.on_submit_email = response.data.on_submit_email;
        this.on_submit_message = response.data.on_submit_message;

        this.generalFormGroup.get("form_name")?.setValue(response.data.form_name);
        this.generalFormGroup.get("picture")?.setValue(response.data.picture);
        this.generalFormGroup.get("available_externally")?.setValue(response.data.available_externally);
        this.generalFormGroup.get("open_date")?.setValue(response.data.open_date);
        this.generalFormGroup.get("close_date")?.setValue(response.data.close_date);
        this.guidlinesFormGroup.get("guidelines")?.setValue(response.data.guidelines);
        this.fields = response.data.data;
        this.dataFormGroup.get("data")?.setValue(JSON.stringify(response.data.data));
        this.headerFormGroup.get("header")?.setValue(response.data.header);
        this.footerFormGroup.get("footer")?.setValue(response.data.footer);
        this.onSubmitFormGroup.get("on_submit_message")?.setValue(response.data.on_submit_message);
        this.workflowFormGroup.get("initialStage")?.setValue(response.data.initialStage);
        this.workflowFormGroup.get("finalStage")?.setValue(response.data.finalStage);
        const stagesData: ApplicationTemplateStageObject[] = JSON.parse(response.data.stages);


        // Add new FormControls to the FormArray for each stage
        stagesData.forEach((stage: any) => {
          this.stages.push(this.fb.group({
            name: [stage.name, Validators.required],
            description: [stage.description],
            allowedTransitions: [stage.allowedTransitions],
            allowedUserRoles: [stage.allowedUserRoles],
            actions: this.fb.array(stage.actions.map((action: any) => {
              return this.fb.group({
                type: [action.type, Validators.required],
                config: this.fb.group({
                  template: [action.config.template],
                  subject: [action.config.subject],
                  endpoint: [action.config.endpoint,],//should be a valid url
                  method: [action.config.method],
                  admin_email: [action.config.admin_email, [Validators.email]]
                })
              })

            }))
          }));
        });
      },
      error: error => {
        this.loading = false;
      }
    })
  }

  setFields(fields: (IFormGenerator[] | IFormGenerator)[]) {
    this.fields = fields;
  }

  setFormField(form_name: string, name: string, value: any) {
    let form: FormGroup | null = null;
    switch (form_name) {
      case "general":
        form = this.generalFormGroup;
        break;
      case "guidelines":
        form = this.guidlinesFormGroup;
        break;
      case "data":
        form = this.dataFormGroup;
        value = JSON.stringify(value);
        break;
      case "header":
        form = this.headerFormGroup;
        break;
      case "footer":
        form = this.footerFormGroup;
        break;
      case "on_submit":
        form = this.onSubmitFormGroup;
        break;

    }
    if (form) {
      const formControl = form.get(name);
      formControl?.setValue(value);
    }
  }

  onFileSelected(files: File[]) {
    if (files.length > 0) {
      this.imageFieldsFiles.set('picture', files[0]);
    }
  }

  private uploadFiles() {
    const uploadUrl = 'file-server/new/applications';
    this.fileUploadService.uploadFiles(this.imageFieldsFiles, uploadUrl)
      .subscribe({
        next: (results) => {
          this.generalFormGroup.get("picture")?.setValue(results[0].response.fullPath);
          // set the image url to the field value

          this.imageFieldsFiles.clear();
          this.submit();
        },
        error: (error) => {
          console.error('Error uploading files', error);
        }
      });
  }

  submit(): void {
    //if there are files to upload, upload them first
    if (this.imageFieldsFiles.size > 0) {
      this.uploadFiles();
      return;
    }

    const data = new FormData();
    if (this.generalFormGroup.valid) {
      if (this.generalFormGroup.get("form_name")?.value) {
        data.append("form_name", this.generalFormGroup.get("form_name")!.value!);
      }
      if (this.generalFormGroup.get("picture")?.value) {
        data.append("picture", this.generalFormGroup.get("picture")!.value!);
      }
      if (this.generalFormGroup.get("available_externally")?.value) {
        data.append("available_externally", this.generalFormGroup.get("available_externally")!.value!);
      }

      if (this.generalFormGroup.get("open_date")?.value)
        data.append("open_date", this.generalFormGroup.get("open_date")?.value!);

      if (this.generalFormGroup.get("close_date")?.value)
        data.append("close_date", this.generalFormGroup.get("close_date")?.value!);
    }
    else {
      alert("Please check the form name, open date and close date fields to make sure they were filled correctly")
      return;
    }
    if (this.guidlinesFormGroup.valid) {
      if (this.guidlinesFormGroup.get("guidelines")?.value)
        data.append("guidelines", this.guidlinesFormGroup.get("guidelines")?.value!);
    }

    data.append("data", JSON.stringify(this.fields));

    if (this.headerFormGroup.valid) {
      if (this.headerFormGroup.get("header")?.value)
        data.append("header", this.headerFormGroup.get("header")?.value!);
    }
    if (this.footerFormGroup.valid) {
      if (this.footerFormGroup.get("footer")?.value)
        data.append("footer", this.footerFormGroup.get("footer")?.value!);
    }
    if (this.onSubmitFormGroup.valid) {
      if (this.onSubmitFormGroup.get("on_submit_email")?.value)
        data.append("on_submit_email", this.onSubmitFormGroup.get("on_submit_email")?.value!);
      if (this.onSubmitFormGroup.get("on_submit_message")?.value)
        data.append("on_submit_message", this.onSubmitFormGroup.get("on_submit_message")?.value!);
    }

    if (this.workflowFormGroup.valid) {
      if (this.workflowFormGroup.get("initialStage")?.value) { data.append("initialStage", this.workflowFormGroup.get("initialStage")?.value!); }
      else {
        alert("The initial stage is required. Please add at least one stage and then select the initial stage")
      }
      if (this.workflowFormGroup.get("finalStage")?.value) {
        data.append("finalStage", this.workflowFormGroup.get("finalStage")?.value!);
      }
      else { alert("The final stage is required. Please add at least one stage and then select the final stage") }
      data.append("stages", JSON.stringify(this.workflowFormGroup.get("stages")?.value!));
    }
    else {
      alert("Please check the workflow form to make sure it is filled correctly. You need to add at least one stage")
      return;
    }

    this.notify.showLoading();
    let dbCall = this.dbService.post<any>(this.formUrl, data)
    if (this.id) {
      data.append("id", this.id)
      dbCall = this.dbService.put<any>(`${this.formUrl}`, data);
    }


    dbCall.pipe(take(1)).subscribe({
      next: data => {
        this.notify.successNotification('Submitted successfully');
        this.notify.hideLoading();
        this.router.navigate(['/application-templates']);
      },
      error: error => {
        this.notify.hideLoading();
        console.log(error);

      }
    });
  }

  get stages() {
    return this.workflowFormGroup.get('stages') as FormArray;
  }

  getActions(stageIndex: number) {
    return (this.stages.at(stageIndex).get('actions') as FormArray);
  }

  addStage() {
    const stageGroup = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      allowedTransitions: [[]],
      actions: this.fb.array([])
    });

    this.stages.push(stageGroup);
  }

  removeStage(index: number) {
    this.stages.removeAt(index);
  }

  addAction(stageIndex: number) {
    const actionGroup = this.fb.group({
      type: ['', Validators.required],
      config: this.fb.group({
        template: [''],
        subject: [''],
        endpoint: [''],
        method: [''],
        admin_email: ['']
      })
    });

    this.getActions(stageIndex).push(actionGroup);
  }

  removeAction(stageIndex: number, actionIndex: number) {
    this.getActions(stageIndex).removeAt(actionIndex);
  }

  setRoles(args: any[], index: number) {
    this.stages.at(index).get('allowedUserRoles')?.setValue(args);
  }
}
