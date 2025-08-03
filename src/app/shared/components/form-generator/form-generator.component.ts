import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ContentChildren, QueryList, TemplateRef, Directive, OnChanges, AfterContentInit, SimpleChanges } from '@angular/core';

import { IFormGenerator, isFormField, isRow } from './form-generator-interface';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { HttpService } from 'src/app/core/services/http/http.service';
import { take } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { generateFormFieldsFromObject } from '../../utils/helper';
import { DatePipe } from '@angular/common';
import { FileUploadResponse, FileUploadService } from 'src/app/core/services/http/file-upload.service';
import { FILE_UPLOAD_BASE_URL } from '../../utils/constants';

// Add a directive to mark field templates
@Directive({
  selector: '[fieldTemplate]'
})
export class FieldTemplateDirective {
  @Input('fieldTemplate') fieldName!: string;
  constructor(public template: TemplateRef<any>) { }
}

@Component({
  selector: 'app-form-generator',
  templateUrl: './form-generator.component.html',
  styleUrls: ['./form-generator.component.css']
})
export class FormGeneratorComponent implements OnInit, OnChanges, AfterContentInit {
  @Input() fields: (IFormGenerator | IFormGenerator[])[] = [];
  @Input() extraData: { key: string, value: any }[] = []
  @Input() url: string = "";
  @Input() id: string | undefined | null;
  @ViewChild('form') form!: HTMLFormElement;
  @Output() onSubmit = new EventEmitter();
  @Output() onExistingDataLoaded = new EventEmitter();
  @ContentChildren(FieldTemplateDirective) fieldTemplates!: QueryList<FieldTemplateDirective>;
  @Input() showSubmitButton: boolean = true;
  @Input() showResetButton: boolean = true;
  @Input() existingObjectUrl: string = "";
  @Input() submitButtonText: string = "Submit";
  @Input() resetButtonText: string = "Reset";
  @Input() formType: "submit" | "filter" | "emit" = "submit";//emit is used to return the fields to the parent component
  @Input() show: boolean = true;
  @Input() enableShowHideButton: boolean = false;
  @Input() formClass: string = "vertical";
  @Input() showHideButtonTitle: string = "form";

  @Output() emitFields = new EventEmitter();
  @Input() numOfRows: number = 3;
  @Input() validationRules: any = {};
  //some random string to differentiate the form from others. useful for generating ids
  formId: string = "";
  @Input() retainExtraFields: string[] = ["id", "uuid"];

  @Input() autoGenerateFields: boolean = false;
  @Input() autoGenerateFieldsKey: string = "";//the key in the data to use to generate fields
  @Input() autoGenerateFieldsExclude: string[] = ["id", "uuid"];//fields to exclude from auto generation

  @Input() dataKey: string = "";// dot-separated key to get the data from the response
  isFormField = isFormField;
  isRow = isRow;
  existingObject: Record<string, any> | null = null;
  imageFieldsFiles: Map<string, File> = new Map();
  imageFieldsUrls: Map<string, string> = new Map();
  //TODO: make this configurable
  fileUploadBaseUrl: string = FILE_UPLOAD_BASE_URL;
  private templateMap = new Map<string, TemplateRef<any>>();
  @Input() sendAsJson: boolean = false;
  @Input() layout: "vertical" | "horizontal" | "grid" = "vertical";
  constructor(private notify: NotifyService,
    private dbService: HttpService, private datePipe: DatePipe, private fileUploadService: FileUploadService) {
    this.formId = uuidv4();
  }

  ngOnInit(): void {
    //if an id was provided, get the existing object
    if (this.id) {
      this.getExistingObject()
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    //if the form fields change, reassign the existing object
    if (changes['fields'] && this.fields.length > 0 && this.existingObject) {
      this.fillFieldsWithExistingData(this.existingObject);
    }
  }

  ngAfterContentInit() {
    this.fieldTemplates.forEach(item => {
      this.templateMap.set(item.fieldName, item.template);
    });
  }

  getCustomTemplate(fieldName: string): TemplateRef<any> | null {
    return this.templateMap.get(fieldName) || null;
  }

  getExistingObject() {
    //if no url was provided, return
    if (!this.existingObjectUrl) {
      console.error("No url provided to get existing object");//TODO: log this to analytics
      return;
    }
    this.notify.showLoading();
    this.dbService.get<any>(`${this.existingObjectUrl}`).subscribe(
      {
        next: data => {
          let source = data.data;

          if (this.autoGenerateFields) {
            this.fields = [];
            source = this.autoGenerateFieldsKey ? source[this.autoGenerateFieldsKey] : source;
            this.fields = generateFormFieldsFromObject(source, this.autoGenerateFieldsExclude);
          } //if autoGenerateFields is true, the fields will be generated from the data
          //for each key, find the corresponding field and set the value
          else {
            //separate the datakey by dots and use subsequent keys to get the data

            if (this.dataKey) {
              const keys = this.dataKey.split(".");

              keys.forEach(key => {
                source = source[key];
              });
            }
            this.onExistingDataLoaded.emit(source);
            this.existingObject = source;
            this.fillFieldsWithExistingData(source);
          }

          this.notify.hideLoading();
          this.retainExtraFields.forEach(field => {
            //check if there's already an extra data object with a key matching the field
            const index = this.extraData.findIndex(data => data.key === field);
            if (index > -1) {
              this.extraData[index].value = source[field];
            }
            else {
              this.extraData.push({ key: field, value: source[field] })
            }
          });

        },
        error: error => {
          this.notify.failNotification("Error loading data. Please try again")
        }
      })
  }

  public fillFieldsWithExistingData(source: Record<string, any>) {
    this.fields.map(field => {
      if (this.isFormField(field)) {
        field.value = source[field.name] === "null" ? null : source[field.name] ?? "";
      }
      else if (this.isRow(field)) {
        field.map(rowField => {
          rowField.value = source[rowField.name] === "null" ? null : source[rowField.name];
        })
      }
    })
  }

  generateFilterUrl() {

    let params: string[] = [];
    const allFields = this.fields.flat();
    allFields.forEach(field => {
      if (field.value) {
        let value = field.type === "date" ? this.formatDate(field.value) : field.value;
        if (Array.isArray(value) && value.length > 0) {
          value = JSON.stringify(value);
          params.push(`${field.name}=${value}`);
        }
        else if (!Array.isArray(value)) {

          params.push(`${field.name}=${value}`);
        }

      }
    });
    this.onSubmit.emit(params.join("&"));
    this.emitFields.emit(this.fields);
  }

  startSubmit(): void {
    const allFields = this.fields.flat();
    if (!this.validateForm(allFields)) {
      this.notify.hideLoading();
      return; // Stop submission if validation fails
    }
    if (this.imageFieldsFiles.size > 0) {
      this.uploadFiles();
    }
    else {
      this.submit();
    }

  }



  private submit(): void {

    const allFields = this.fields.flat().filter(field => field.name !== "");
    if (this.formType === "emit") {
      this.onSubmit.emit(allFields);
      return;
    }
    this.notify.showLoading();
    let data: any;
    if (this.sendAsJson) {
      data = {};
    }
    else {
      data = new FormData();
    }

    allFields.forEach(field => {


      if (field.type === "date") {
        if (this.sendAsJson) {
          data[field.name] = this.formatDate(field.value) || "";
        }
        else {
          data.append(field.name, this.formatDate(field.value) || "");
        }
      }
      else {
        if (this.sendAsJson) {
          data[field.name] = field.value || "";
        }
        else {
          data.append(field.name, field.value || "");
        }
      }
    });
    this.extraData.forEach(item => {
      if (this.sendAsJson) {
        data[item.key] = item.value
      }
      else {
        data.append(item.key, item.value)
      }
    });
    let dbCall = this.dbService.post<any>(this.url, data)
    if (this.id) {
      if (this.sendAsJson) {
        data["id"] = this.id
      }
      else {
        data.append("id", this.id)
      }
      dbCall = this.dbService.put<any>(this.url, data);
    }


    dbCall.pipe(take(1)).subscribe({
      next: data => {
        this.notify.successNotification('Submitted successfully');
        this.onSubmit.emit(true)


      },
      error: error => {
        this.notify.hideLoading();
        // this.notify.noConnectionNotification();

        console.log(error);

      }
    });
  }

  setFieldValue(args: any, action: IFormGenerator) {
    action.value = args;
    //run the onChange function
    if (action.onChange) { action.onChange(action.value); }
  }

  clearFieldValue(action: IFormGenerator) {
    action.value = "";
    //run the onChange function
    if (action.onChange) { action.onChange(action.value); }
  }

  showOrHide() {
    this.show = !this.show
  }

  validateForm(fields: IFormGenerator[]): boolean {
    for (const field of fields) {
      if (field.required && !field.value) {
        this.notify.failNotification(`Field '${field.label}' is required.`);
        return false;
      }

      if (field.minLength && field.value?.trim() && field.value.length < field.minLength) {
        this.notify.failNotification(
          `Field '${field.label}' should be at least ${field.minLength} characters long.`
        );
        return false;
      }

      if (field.maxLength && field.value.length > field.maxLength) {
        this.notify.failNotification(
          `Field '${field.label}' should be at most ${field.maxLength} characters long.`
        );
        return false;
      }

      if (field.customValidation) {
        // For custom validation rule "fieldsMatch", pass an object with both field values
        if (field.customValidation.fieldsMatch) {
          let fieldsToMatch = field.customValidation.fieldsMatch;
          //the rules will be an array of field names which must match. the value must match each field
          for (let i = 0; i < fieldsToMatch.length; i++) {
            const matchFieldName = fieldsToMatch[i];
            const matchField = fields.find((f) => f.name === matchFieldName);
            if (matchField) {
              if (field.value != matchField.value) {
                this.notify.failNotification(
                  `Fields '${field.label}' and '${matchField.label}' should match.`
                );
                return false;
              }
            }

          }
        }

      }
    }

    return true; // Form is valid
  }


  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }

  onFileSelected(files: File[], field: IFormGenerator) {
    if (files.length > 0) {
      field.value = files[0];
      this.imageFieldsFiles.set(field.name, files[0]);
      this.imageFieldsUrls.set(field.name, `${this.fileUploadBaseUrl}/${field.assetType}`)
    }
  }

  private uploadFiles() {
    this.fileUploadService.uploadFiles(this.imageFieldsFiles, this.imageFieldsUrls)
      .subscribe({
        next: (results) => {
          // set the image url to the field value
          results.forEach((result: FileUploadResponse) => {
            const field = this.fields.flat().find((f) => f.name === result.key);
            if (field) {
              field.value = result.response.fullPath;
            }
          });
          this.imageFieldsFiles.clear();
          this.imageFieldsUrls.clear();
          this.submit();
        },
        error: (error) => {
          console.error('Error uploading files', error);
        }
      });
  }

  public resetForm() {

    this.fields.forEach(field => {
      if (this.isFormField(field)) {
        field.value = "";
      }
      else if (this.isRow(field)) {
        field.map(rowField => {
          rowField.value = "";
        })
      }
    });
    if (this.formType === "filter") {
      this.generateFilterUrl();
    }
  }

  public isFilterFormValid(): boolean {
    if (this.formType !== "filter") {
      return true;
    }
    const allFields = this.fields.flat();
    return allFields.some(field => field.value !== null && field.value !== "");
  }

  onDateChange(field: IFormGenerator, start: any, end: any) {

    const dates = [];
    if (start.value) {
      // const startDate = this.datePipe.transform(start.value, 'dd/MM/yyyy');
      dates.push(this.parseDate(start.value));
    }
    if (end.value) {
      // const endDate = this.datePipe.transform(end.value, 'dd/MM/yyyy');
      dates.push(this.parseDate(end.value));
    }
    field.value = dates.join(" to ");
  }

  // Add new properties for date range
  getDateRangeValue(field: IFormGenerator): { start: Date | null, end: Date | null } {
    if (!field.value) return { start: null, end: null };

    try {
      const [startStr, endStr] = field.value.split(" to ");
      const start = startStr ? new Date(this.parseDate(startStr)) : null;
      const end = endStr ? new Date(this.parseDate(endStr)) : null;
      return { start, end };
    } catch (e) {
      console.error('Error parsing date range:', e);
      return { start: null, end: null };
    }
  }

  private parseDate(dateStr: string): string {
    // Convert DD/MM/YYYY to YYYY-MM-DD for Date constructor
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  }

}
