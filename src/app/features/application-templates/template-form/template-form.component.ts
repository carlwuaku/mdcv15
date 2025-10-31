import { Component, OnInit, Inject, ViewChild, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { HttpService } from 'src/app/core/services/http/http.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { ApplicationTemplatesService } from '../application-templates.service';
import { ApplicationTemplateStageObject } from '../../../shared/types/application-template.model';
import { FileUploadService } from 'src/app/core/services/http/file-upload.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogFormComponent } from 'src/app/shared/components/dialog-form/dialog-form.component';
import { ApplicationFormTemplateActionObject } from '../../application-forms/models/application-form-template-action.model';
import { FILE_UPLOAD_BASE_URL } from 'src/app/shared/utils/constants';
import { Criteria } from 'src/app/shared/types/Criteria.model';

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
  criteria: Criteria<string>[] = [{ field: "", value: [], operator: "equals" }];
  criteriaFormGroup: FormGroup = new FormGroup({
    criteria: this.fb.array<Criteria<string>[]>([])
  });
  loading: boolean = false;
  imageFieldsFiles: Map<string, File> = new Map();
  imageFieldsUrls: Map<string, string> = new Map();
  fileUploadBaseUrl: string = FILE_UPLOAD_BASE_URL;
  defaultApiCallActions: any[] = [];
  //the user can select the fields from some common templates. in this case the url to the form fields
  commonTemplateFields: (IFormGenerator[] | IFormGenerator)[] = [];
  @ViewChild('previewFieldsDialog') previewFieldsDialog!: TemplateRef<any>;
  actionTypes: ApplicationFormTemplateActionObject[] = [];

  constructor(ar: ActivatedRoute, private router: Router, private notify: NotifyService, private dbService: HttpService,
    private templateService: ApplicationTemplatesService, @Inject(FormBuilder) private fb: FormBuilder, private fileUploadService: FileUploadService,
    private dialog: MatDialog
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
    this.getApplicationActionTypes();
  }

  getApplicationActionTypes() {
    this.templateService.getApplicationActionTypes().pipe(take(1)).subscribe({
      next: response => {
        this.actionTypes = response.data;
      },
      error: error => {
        console.error('Error fetching application action types', error);
        this.actionTypes = [];
      }
    });
  }

  // loadData() {
  //   this.loading = true;
  //   this.templateService.getTemplate(this.id).subscribe({
  //     next: response => {
  //       this.loading = false;
  //       this.guidelines = response.data.guidelines;
  //       this.header = response.data.header;
  //       this.footer = response.data.footer;
  //       this.on_submit_email = response.data.on_submit_email;
  //       this.on_submit_message = response.data.on_submit_message;

  //       this.generalFormGroup.get("form_name")?.setValue(response.data.form_name);
  //       this.generalFormGroup.get("picture")?.setValue(response.data.picture);
  //       this.generalFormGroup.get("available_externally")?.setValue(response.data.available_externally);
  //       this.generalFormGroup.get("open_date")?.setValue(response.data.open_date);
  //       this.generalFormGroup.get("close_date")?.setValue(response.data.close_date);
  //       this.guidlinesFormGroup.get("guidelines")?.setValue(response.data.guidelines);
  //       this.fields = response.data.data;
  //       this.dataFormGroup.get("data")?.setValue(JSON.stringify(response.data.data));
  //       this.headerFormGroup.get("header")?.setValue(response.data.header);
  //       this.footerFormGroup.get("footer")?.setValue(response.data.footer);
  //       this.onSubmitFormGroup.get("on_submit_message")?.setValue(response.data.on_submit_message);
  //       this.workflowFormGroup.get("initialStage")?.setValue(response.data.initialStage);
  //       this.workflowFormGroup.get("finalStage")?.setValue(response.data.finalStage);
  //       const stagesData: ApplicationTemplateStageObject[] = JSON.parse(response.data.stages);


  //       // Add new FormControls to the FormArray for each stage
  //       stagesData.forEach((stage: any) => {
  //         this.stages.push(this.fb.group({
  //           name: [stage.name, Validators.required],
  //           description: [stage.description],
  //           allowedTransitions: [stage.allowedTransitions],
  //           allowedUserRoles: [stage.allowedUserRoles],
  //           actions: this.fb.array(stage.actions.map((action: any) => {
  //             return this.fb.group({
  //               type: [action.type, Validators.required],
  //               config: this.fb.group({
  //                 template: [action.config.template],
  //                 subject: [action.config.subject],
  //                 endpoint: [action.config.endpoint,],//should be a valid url
  //                 method: [action.config.method],
  //                 admin_email: [action.config.admin_email, [Validators.email]]
  //               })
  //             })

  //           }))
  //         }));
  //       });
  //     },
  //     error: error => {
  //       this.loading = false;
  //     }
  //   })
  // }

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
      case "criteria":
        form = this.criteriaFormGroup;
        value = JSON.stringify(value);
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
      this.imageFieldsUrls.set('picture', `${this.fileUploadBaseUrl}/applications`)
    }
  }

  private uploadFiles() {
    this.fileUploadService.uploadFiles(this.imageFieldsFiles, this.imageFieldsUrls)
      .subscribe({
        next: (results) => {
          this.generalFormGroup.get("picture")?.setValue(results[0].response.fullPath);
          // set the image url to the field value

          this.imageFieldsFiles.clear();
          this.imageFieldsUrls.clear();
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
      if (this.workflowFormGroup.get("initialStage")?.value) {
        data.append("initialStage", this.workflowFormGroup.get("initialStage")?.value!);
      } else {
        alert("The initial stage is required. Please add at least one stage and then select the initial stage");
        return;
      }

      if (this.workflowFormGroup.get("finalStage")?.value) {
        data.append("finalStage", this.workflowFormGroup.get("finalStage")?.value!);
      } else {
        alert("The final stage is required. Please add at least one stage and then select the final stage");
        return;
      }
      if (this.criteriaFormGroup.valid) {
        try {
          let criteriaFormValues = this.criteriaFormGroup.get("criteria")?.value;
          if (criteriaFormValues) {
            let criteria = JSON.parse(criteriaFormValues);
            //make sure each criteria has a field, operator, and value which is an array of strings
            if (!Array.isArray(criteria) || criteria.some(c => !c.field || !c.operator || !c.value || !Array.isArray(c.value))) {
              alert("The criteria needs to be a valid list");
              return;
            }
            data.append("criteria", criteriaFormValues);
          }
        } catch (error) {
          if (!window.confirm("The criteria is not valid, would you like to continue?")) return
        }

      }

      // Process stages with enhanced action serialization
      const processedStages = this.stages.controls.map(stageControl => {
        const stage = stageControl.value;
        const processedActions = stage.actions.map((action: any) => {
          const processedAction = {
            type: action.type,
            config_type: action.config_type,//api_call, email, admin_email
            config: { ...action.config }
          };

          // Process API call specific configurations
          if (action.config_type === 'api_call', action.config_type === 'internal_api_call') {
            processedAction.config = this.buildApiConfig(action.config);
          }

          return processedAction;
        });

        return {
          ...stage,
          actions: processedActions
        };
      });

      data.append("stages", JSON.stringify(processedStages));
    }


    // if (this.workflowFormGroup.valid) {
    //   if (this.workflowFormGroup.get("initialStage")?.value) { data.append("initialStage", this.workflowFormGroup.get("initialStage")?.value!); }
    //   else {
    //     alert("The initial stage is required. Please add at least one stage and then select the initial stage")
    //   }
    //   if (this.workflowFormGroup.get("finalStage")?.value) {
    //     data.append("finalStage", this.workflowFormGroup.get("finalStage")?.value!);
    //   }
    //   else { alert("The final stage is required. Please add at least one stage and then select the final stage") }
    //   data.append("stages", JSON.stringify(this.workflowFormGroup.get("stages")?.value!));
    // }
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
      config_type: ['api_call', Validators.required], // Default to API call
      config: this.fb.group({
        // Email configs
        template: [''],
        subject: [''],
        admin_email: [''],

        // API call configs
        endpoint: [''],
        method: ['GET'],
        auth_token: [''],
        headers: this.fb.array([]),
        body_mapping: this.fb.array([]),
        query_params: this.fb.array([])
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

  // Add these methods to your TemplateFormComponent class

  /**
   * Get headers FormArray for a specific action
   */
  getHeadersArray(stageIndex: number, actionIndex: number): FormArray {
    const action = this.getActions(stageIndex).at(actionIndex);
    let headersArray = action.get('config.headers') as FormArray;

    if (!headersArray) {
      headersArray = this.fb.array([]);
      const configGroup = action.get('config') as FormGroup;
      configGroup.addControl('headers', headersArray);
    }

    return headersArray;
  }

  /**
   * Get body mapping FormArray for a specific action
   */
  getBodyMappingArray(stageIndex: number, actionIndex: number): FormArray {
    const action = this.getActions(stageIndex).at(actionIndex);
    let bodyMappingArray = action.get('config.body_mapping') as FormArray;

    if (!bodyMappingArray) {
      bodyMappingArray = this.fb.array([]);
      const configGroup = action.get('config') as FormGroup;
      configGroup.addControl('body_mapping', bodyMappingArray);
    }

    return bodyMappingArray;
  }

  /**
   * Get query params FormArray for a specific action
   */
  getQueryParamsArray(stageIndex: number, actionIndex: number): FormArray {
    const action = this.getActions(stageIndex).at(actionIndex);
    let queryParamsArray = action.get('config.query_params') as FormArray;

    if (!queryParamsArray) {
      queryParamsArray = this.fb.array([]);
      const configGroup = action.get('config') as FormGroup;
      configGroup.addControl('query_params', queryParamsArray);
    }

    return queryParamsArray;
  }

  /**
   * Add a new header
   */
  addHeader(stageIndex: number, actionIndex: number) {
    const headerGroup = this.fb.group({
      name: ['', Validators.required],
      value: ['', Validators.required]
    });

    this.getHeadersArray(stageIndex, actionIndex).push(headerGroup);
  }

  /**
   * Remove a header
   */
  removeHeader(stageIndex: number, actionIndex: number, headerIndex: number) {
    this.getHeadersArray(stageIndex, actionIndex).removeAt(headerIndex);
  }

  /**
   * Add a new body mapping
   */
  addBodyMapping(stageIndex: number, actionIndex: number) {
    const mappingGroup = this.fb.group({
      api_field: ['', Validators.required],
      mapping_type: ['field', Validators.required],
      source_field: [''],
      static_value: [''],
      template: [''],
      transform_type: [''],
      default_value: ['']
    });

    this.getBodyMappingArray(stageIndex, actionIndex).push(mappingGroup);
  }

  /**
   * Remove a body mapping
   */
  removeBodyMapping(stageIndex: number, actionIndex: number, mappingIndex: number) {
    this.getBodyMappingArray(stageIndex, actionIndex).removeAt(mappingIndex);
  }

  /**
   * Add a new query parameter
   */
  addQueryParam(stageIndex: number, actionIndex: number) {
    const paramGroup = this.fb.group({
      param_name: ['', Validators.required],
      form_field: ['', Validators.required],
      default_value: ['']
    });

    this.getQueryParamsArray(stageIndex, actionIndex).push(paramGroup);
  }

  /**
   * Remove a query parameter
   */
  removeQueryParam(stageIndex: number, actionIndex: number, paramIndex: number) {
    this.getQueryParamsArray(stageIndex, actionIndex).removeAt(paramIndex);
  }

  /**
   * Test API call configuration
   */
  testApiCall(stageIndex: number, actionIndex: number) {
    const action = this.getActions(stageIndex).at(actionIndex);
    const config = action.get('config')?.value;

    if (!config.endpoint || !config.method) {
      this.notify.failNotification('Please provide endpoint and method before testing');
      return;
    }

    // Create sample data for testing
    const sampleData: any = {};
    this.fields.forEach(field => {
      if (Array.isArray(field)) {
        field.forEach(f => {
          sampleData[f.name] = this.generateSampleValue(f);
        });
      } else {
        sampleData[field.name] = this.generateSampleValue(field);
      }
    });

    // Build the test payload
    const testPayload = {
      action: {
        type: 'api_call',
        config: this.buildApiConfig(config)
      },
      sample_data: sampleData
    };

    // Call test endpoint
    this.notify.showLoading();
    this.dbService.post<any>('applications/templates/test-action', testPayload)
      .subscribe({
        next: (response) => {
          this.notify.hideLoading();
          this.notify.successNotification('API call test successful');
          console.log('Test response:', response);
        },
        error: (error) => {
          this.notify.hideLoading();
          this.notify.failNotification('API call test failed: ' + (error.message || 'Unknown error'));
          console.error('Test error:', error);
        }
      });
  }

  /**
   * Generate sample value for testing based on field type
   */
  private generateSampleValue(field: IFormGenerator): any {
    switch (field.type) {
      case 'email':
        return 'test@example.com';
      case 'number':
        return 123;
      case 'date':
        return new Date().toISOString().split('T')[0];
      case 'select':
        return field.options && field.options.length > 0 ? field.options[0].value : 'option1';
      case 'checkbox':
        return true;
      default:
        return `Sample ${field.name}`;
    }
  }

  /**
   * Build API configuration object for submission
   */
  private buildApiConfig(config: any): any {
    const apiConfig: any = {
      endpoint: config.endpoint,
      method: config.method
    };

    // Add auth token if provided
    if (config.auth_token) {
      apiConfig.auth_token = config.auth_token;
    }

    // Process headers
    if (config.headers && config.headers.length > 0) {
      apiConfig.headers = {};
      config.headers.forEach((header: any) => {
        if (header.name && header.value) {
          apiConfig.headers[header.name] = header.value;
        }
      });
    }

    // Process body mapping
    if (config.body_mapping && config.body_mapping.length > 0) {
      apiConfig.body_mapping = {};
      config.body_mapping.forEach((mapping: any) => {
        if (mapping.api_field) {
          switch (mapping.mapping_type) {
            case 'field':
              apiConfig.body_mapping[mapping.api_field] = `@${mapping.source_field}`;
              break;

            case 'template':
              apiConfig.body_mapping[mapping.api_field] = mapping.template;
              break;
            case 'transform':
              apiConfig.body_mapping[mapping.api_field] = {
                source: `@${mapping.source_field}`,
                transform: {
                  type: mapping.transform_type
                },
                default: mapping.default_value
              };
              break;
            case 'static':
            default:
              apiConfig.body_mapping[mapping.api_field] = mapping.static_value;
              break;
          }
        }
      });
    }

    // Process query parameters
    if (config.query_params && config.query_params.length > 0) {
      apiConfig.query_params = {};
      config.query_params.forEach((param: any) => {
        if (param.param_name && param.form_field) {
          apiConfig.query_params[param.param_name] = `@${param.form_field}`;
        }
      });
    }

    return apiConfig;
  }




  getFieldsList(): IFormGenerator[] {
    // Return a flat list of fields for the form generator
    return this.fields.reduce((acc: IFormGenerator[], field: IFormGenerator | IFormGenerator[]) => {
      if (Array.isArray(field)) {
        acc.push(...field);
      } else {
        acc.push(field);
      }
      return acc;
    }, []);
  }

  /**
   * Enhanced loadData method to properly load API call configurations
   */
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
        this.criteriaFormGroup.get("criteria")?.setValue(response.data.criteria);

        const stagesData: ApplicationTemplateStageObject[] = JSON.parse(response.data.stages);

        // Add new FormControls to the FormArray for each stage
        stagesData.forEach((stage: any) => {
          const stageGroup = this.fb.group({
            name: [stage.name, Validators.required],
            description: [stage.description],
            allowedTransitions: [stage.allowedTransitions],
            allowedUserRoles: [stage.allowedUserRoles],
            actions: this.fb.array([])
          });

          // Process actions with enhanced configuration
          stage.actions.forEach((action: any) => {
            const actionGroup = this.fb.group({
              type: [action.type, Validators.required],
              config_type: [action.config_type || 'api_call'],
              config: this.fb.group({
                // Basic configs
                template: [action.config.template || ''],
                subject: [action.config.subject || ''],
                endpoint: [action.config.endpoint || ''],
                method: [action.config.method || 'GET'],
                admin_email: [action.config.admin_email || '', [Validators.email]],
                auth_token: [action.config.auth_token || ''],

                // Complex configs as FormArrays
                headers: this.fb.array([]),
                body_mapping: this.fb.array([]),
                query_params: this.fb.array([])
              })
            });

            // Load headers if they exist
            if (action.config.headers) {
              const headersArray = actionGroup.get('config.headers') as FormArray;
              Object.keys(action.config.headers).forEach(headerName => {
                headersArray.push(this.fb.group({
                  name: [headerName],
                  value: [action.config.headers[headerName]]
                }));
              });
            }

            // Load body mapping if it exists
            if (action.config.body_mapping) {
              const bodyMappingArray = actionGroup.get('config.body_mapping') as FormArray;
              /**#previewFieldsDialog
api_field
:
"practitioner_type"
default_value
:
""
mapping_type
:
"field"
source_field
:
"practitioner_type"
static_value
:
""
template
:
""
transform_type
:
"" */
              Object.keys(action.config.body_mapping).forEach((apiField: string) => {
                const mapping = action.config.body_mapping[apiField];
                const mappingGroup = this.createMappingGroup(apiField, mapping);
                bodyMappingArray.push(mappingGroup);
              });
            }

            // Load query params if they exist
            if (action.config.query_params) {
              const queryParamsArray = actionGroup.get('config.query_params') as FormArray;
              Object.keys(action.config.query_params).forEach(paramName => {
                queryParamsArray.push(this.fb.group({
                  param_name: [paramName],
                  form_field: [action.config.query_params[paramName].replace('@', '')],
                  default_value: ['']
                }));
              });
            }

            (stageGroup.get('actions') as FormArray).push(actionGroup);
          });

          this.stages.push(stageGroup);
        });
      },
      error: error => {
        this.loading = false;
        this.notify.failNotification('Failed to load template data');
        console.error('Load error:', error);
      }
    });
  }

  /**
   * Create mapping group based on saved configuration
   */
  private createMappingGroup(apiField: string, mapping: any): FormGroup {
    let mappingType = 'field';
    let sourceField = '';
    let staticValue = '';
    let template = '';
    let transformType = '';
    let defaultValue = '';

    if (typeof mapping === 'string') {
      if (mapping.startsWith('@')) {
        mappingType = 'field';
        sourceField = mapping.substring(1);
      } else if (mapping.includes('{{')) {
        mappingType = 'template';
        template = mapping;
      } else {
        mappingType = 'static';
        staticValue = mapping;
      }
    } else if (typeof mapping === 'object' && mapping.source) {
      mappingType = 'transform';
      sourceField = mapping.source.replace('@', '');
      transformType = mapping.transform?.type || '';
      defaultValue = mapping.default || '';
    }

    return this.fb.group({
      api_field: [apiField, Validators.required],
      mapping_type: [mappingType, Validators.required],
      source_field: [sourceField],
      static_value: [staticValue],
      template: [template],
      transform_type: [transformType],
      default_value: [defaultValue]
    });
  }


  setDefaultApiCallActions(actions: any[]) {
    this.defaultApiCallActions = actions;
  }


  /**
   * Handle when user selects a default template
   * This applies the selected template to the current action
   */
  defaultApiCallTemplateSelected(stageIndex: number, actionIndex: number, selectedName: string): void {
    if (!selectedName || !this.defaultApiCallActions.length) {
      return;
    }

    // Find the selected template
    const selectedTemplate = this.defaultApiCallActions.find(action => action.name === selectedName);

    if (!selectedTemplate) {
      this.notify.failNotification('Selected template not found');
      return;
    }

    try {
      // Get the current action form group
      const actionGroup = this.getActions(stageIndex).at(actionIndex);
      const configGroup = actionGroup.get('config') as FormGroup;

      // Apply the template configuration
      this.applyApiCallTemplate(configGroup, selectedTemplate.config, stageIndex, actionIndex);

      this.notify.successNotification(`Template "${selectedTemplate.label}" applied successfully`);

      console.log('Applied template:', selectedTemplate);

    } catch (error) {
      console.error('Error applying template:', error);
      this.notify.failNotification('Failed to apply template: ' + error);
    }
  }

  /**
   * when the user selects an action type, set the configuration fields accordingly
   * @param stageIndex
   * @param actionIndex
   * @param type
   * @returns
   */
  setActionType(stageIndex: number, actionIndex: number, type: string): void {
    if (!type || !this.actionTypes.length) {
      return;
    }

    // Find the selected template
    const selectedActionType = this.actionTypes.find(action => action.type === type);

    if (!selectedActionType) {
      this.notify.failNotification('Selected action type not found');
      return;
    }

    const actionGroup = this.getActions(stageIndex).at(actionIndex);

    actionGroup.get('config_type')?.setValue(selectedActionType.config_type);
    const configGroup = actionGroup.get('config') as FormGroup;
    this.applyApiCallTemplate(configGroup, selectedActionType.config, stageIndex, actionIndex);
    // Reset the configuration fields based on action type. based on the keys of the selected action type config property, show/hide fields. those in the config property will be shown and their fields set to whatever their value is in the config property
    // Object.keys(selectedActionType.config).forEach((key) => {
    //   if (configGroup.get(key)) {
    //     configGroup.get(key)?.setValue(selectedActionType.config[key as keyof typeof selectedActionType.config] || '');
    //   } else {
    //     // If the key does not exist, disable or hide the field
    //   }
    // });
  }
  /**
   * Apply the selected template configuration to the form
   */
  private applyApiCallTemplate(configGroup: FormGroup, templateConfig: any, stageIndex: number, actionIndex: number): void {
    // Set basic configuration fields
    if (templateConfig.endpoint) {
      configGroup.get('endpoint')?.setValue(templateConfig.endpoint);
    }

    if (templateConfig.method) {
      configGroup.get('method')?.setValue(templateConfig.method);
    }

    if (templateConfig.auth_token) {
      configGroup.get('auth_token')?.setValue(templateConfig.auth_token);
    }

    // Apply headers
    if (templateConfig.headers) {
      this.applyTemplateHeaders(stageIndex, actionIndex, templateConfig.headers);
    }

    // Apply body mapping
    if (templateConfig.body_mapping) {
      this.applyTemplateBodyMapping(stageIndex, actionIndex, templateConfig.body_mapping);
    }

    // Apply query parameters
    if (templateConfig.query_params) {
      this.applyTemplateQueryParams(stageIndex, actionIndex, templateConfig.query_params);
    }
  }

  /**
   * Apply template headers to the form
   */
  private applyTemplateHeaders(stageIndex: number, actionIndex: number, headers: any): void {
    const headersArray = this.getHeadersArray(stageIndex, actionIndex);

    // Clear existing headers
    while (headersArray.length !== 0) {
      headersArray.removeAt(0);
    }

    // Add new headers from template
    Object.keys(headers).forEach(headerName => {
      const headerGroup = this.fb.group({
        name: [headerName, Validators.required],
        value: [headers[headerName], Validators.required]
      });
      headersArray.push(headerGroup);
    });
  }

  /**
   * Apply template body mapping to the form
   */
  private applyTemplateBodyMapping(stageIndex: number, actionIndex: number, bodyMapping: any): void {
    const bodyMappingArray = this.getBodyMappingArray(stageIndex, actionIndex);

    // Clear existing body mappings
    while (bodyMappingArray.length !== 0) {
      bodyMappingArray.removeAt(0);
    }

    // Add new body mappings from template
    Object.keys(bodyMapping).forEach(apiField => {
      const mapping = bodyMapping[apiField];
      const mappingGroup = this.createMappingGroupFromTemplate(apiField, mapping);
      bodyMappingArray.push(mappingGroup);
    });
  }

  /**
   * Apply template query parameters to the form
   */
  private applyTemplateQueryParams(stageIndex: number, actionIndex: number, queryParams: any): void {
    const queryParamsArray = this.getQueryParamsArray(stageIndex, actionIndex);

    // Clear existing query parameters
    while (queryParamsArray.length !== 0) {
      queryParamsArray.removeAt(0);
    }

    // Add new query parameters from template
    Object.keys(queryParams).forEach(paramName => {
      const formField = queryParams[paramName].replace('@', ''); // Remove @ prefix
      const paramGroup = this.fb.group({
        param_name: [paramName, Validators.required],
        form_field: [formField, Validators.required],
        default_value: ['']
      });
      queryParamsArray.push(paramGroup);
    });
  }

  /**
   * Create a mapping group from template data
   */
  private createMappingGroupFromTemplate(apiField: string, mapping: any): FormGroup {
    let mappingType = 'field';
    let sourceField = '';
    let staticValue = '';
    let template = '';
    let transformType = '';
    let defaultValue = '';

    if (typeof mapping === 'string') {
      if (mapping.startsWith('@')) {
        mappingType = 'field';
        sourceField = mapping.substring(1);
      } else if (mapping.includes('{{') && mapping.includes('}}')) {
        mappingType = 'template';
        template = mapping;
      } else {
        mappingType = 'static';
        staticValue = mapping;
      }
    } else if (typeof mapping === 'object' && mapping !== null) {
      if (mapping.source) {
        mappingType = 'transform';
        sourceField = mapping.source.replace('@', '');
        transformType = mapping.transform?.type || '';
        defaultValue = mapping.default || '';
      }
    }

    return this.fb.group({
      api_field: [apiField, Validators.required],
      mapping_type: [mappingType, Validators.required],
      source_field: [sourceField],
      static_value: [staticValue],
      template: [template],
      transform_type: [transformType],
      default_value: [defaultValue]
    });
  }

  /**
   * Clear all API call configuration (useful for "reset" functionality)
   */
  clearApiCallConfiguration(stageIndex: number, actionIndex: number): void {
    const actionGroup = this.getActions(stageIndex).at(actionIndex);
    const configGroup = actionGroup.get('config') as FormGroup;

    // Clear basic fields
    configGroup.get('endpoint')?.setValue('');
    configGroup.get('method')?.setValue('GET');
    configGroup.get('auth_token')?.setValue('');

    // Clear arrays
    const headersArray = this.getHeadersArray(stageIndex, actionIndex);
    while (headersArray.length !== 0) {
      headersArray.removeAt(0);
    }

    const bodyMappingArray = this.getBodyMappingArray(stageIndex, actionIndex);
    while (bodyMappingArray.length !== 0) {
      bodyMappingArray.removeAt(0);
    }

    const queryParamsArray = this.getQueryParamsArray(stageIndex, actionIndex);
    while (queryParamsArray.length !== 0) {
      queryParamsArray.removeAt(0);
    }

    this.notify.successNotification('API call configuration cleared');
  }

  /**
   * Preview the current API call configuration
   */
  previewApiCallConfiguration(stageIndex: number, actionIndex: number): void {
    const actionGroup = this.getActions(stageIndex).at(actionIndex);
    const config = actionGroup.get('config')?.value;

    if (!config.endpoint) {
      this.notify.failNotification('No endpoint configured to preview');
      return;
    }

    const processedConfig = this.buildApiConfig(config);

    // Create a preview object
    const preview = {
      endpoint: processedConfig.endpoint,
      method: processedConfig.method,
      headers: processedConfig.headers || {},
      body_mapping: processedConfig.body_mapping || {},
      query_params: processedConfig.query_params || {}
    };

    // Show preview in console (you could also show in a modal)
    console.log('API Call Configuration Preview:', preview);

    // You could also open a modal with the preview
    this.showConfigurationPreview(preview);
  }

  /**
   * Show configuration preview in a modal or alert
   */
  private showConfigurationPreview(config: any): void {
    const previewText = `
API Call Configuration Preview:

Endpoint: ${config.endpoint}
Method: ${config.method}

Headers:
${JSON.stringify(config.headers, null, 2)}

Body Mapping:
${JSON.stringify(config.body_mapping, null, 2)}

Query Parameters:
${JSON.stringify(config.query_params, null, 2)}
  `;

    // Simple alert (you could replace with a proper modal)
    alert(previewText);
  }

  /**
   * Validate that the selected template is compatible with current form fields
   */
  private validateTemplateCompatibility(templateConfig: any): { isCompatible: boolean; warnings: string[] } {
    const warnings: string[] = [];
    const currentFieldNames = this.getCurrentFormFieldNames();

    if (templateConfig.body_mapping) {
      Object.values(templateConfig.body_mapping).forEach((mapping: any) => {
        if (typeof mapping === 'string' && mapping.startsWith('@')) {
          const fieldName = mapping.substring(1);
          if (!currentFieldNames.includes(fieldName)) {
            warnings.push(`Field "${fieldName}" required by template is not available in current form`);
          }
        }
      });
    }

    if (templateConfig.query_params) {
      Object.values(templateConfig.query_params).forEach((mapping: any) => {
        if (typeof mapping === 'string' && mapping.startsWith('@')) {
          const fieldName = mapping.substring(1);
          if (!currentFieldNames.includes(fieldName)) {
            warnings.push(`Field "${fieldName}" required by template is not available in current form`);
          }
        }
      });
    }

    return {
      isCompatible: warnings.length === 0,
      warnings
    };
  }

  /**
   * Get current form field names
   */
  private getCurrentFormFieldNames(): string[] {
    const fieldNames: string[] = [];

    this.fields.forEach(field => {
      if (Array.isArray(field)) {
        field.forEach(f => fieldNames.push(f.name));
      } else {
        fieldNames.push(field.name);
      }
    });

    return fieldNames;
  }

  /**
   * Enhanced template selection with validation
   */
  defaultApiCallTemplateSelectedWithValidation(stageIndex: number, actionIndex: number, selectedName: string): void {
    if (!selectedName || !this.defaultApiCallActions.length) {
      return;
    }

    const selectedTemplate = this.defaultApiCallActions.find(action => action.name === selectedName);

    if (!selectedTemplate) {
      this.notify.failNotification('Selected template not found');
      return;
    }

    // Validate compatibility
    const validation = this.validateTemplateCompatibility(selectedTemplate.config);

    if (!validation.isCompatible) {
      const warningMessage = `Template may not be fully compatible:\n${validation.warnings.join('\n')}`;

      if (confirm(`${warningMessage}\n\nDo you want to apply it anyway?`)) {
        this.defaultApiCallTemplateSelected(stageIndex, actionIndex, selectedName);
      }
    } else {
      this.defaultApiCallTemplateSelected(stageIndex, actionIndex, selectedName);
    }
  }

  commonApplicationTemplateUrlSelected(url: string): void {
    //get the form fields from the url
    //display them in a modal for confirmation
    // if the user confirms, set the fields in the form
    if (!url) {
      return;
    }
    this.templateService.getCommonApplicationTemplate(url).subscribe({
      next: (response) => {

        this.commonTemplateFields = response.data;

        // this.dataFormGroup.get("data")?.setValue(JSON.stringify(fields));
        //show a preview modal with the fields
        const dialogRef = this.dialog.open(this.previewFieldsDialog, {
          data: {
            title: "Filter",
            fields: this.commonTemplateFields,
            formType: "filter"
          },
          width: '50vw'
        });
        dialogRef.afterClosed().subscribe((result: IFormGenerator[] | false) => {

          if (result) {
            this.setFields(result);


          }
          this.commonTemplateFields = [];
        });
        this.notify.successNotification('Common application template applied successfully');

      }
      , error: (error) => {
        this.notify.failNotification('Failed to load common application template: ' + (error.message || 'Unknown error'));
        console.error('Common template load error:', error);
      }
    });
  }

}
