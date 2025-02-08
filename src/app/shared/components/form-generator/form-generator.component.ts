import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { IFormGenerator, isFormField, isRow } from './form-generator-interface';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { HttpService } from 'src/app/core/services/http/http.service';
import { take } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { generateFormFieldsFromObject } from '../../utils/helper';
import { DatePipe } from '@angular/common';
import { ProgressItem } from '../progress-dialog/progress-dialog.component';
import { FileUploadResponse, FileUploadService } from 'src/app/core/services/http/file-upload.service';

@Component({
  selector: 'app-form-generator',
  templateUrl: './form-generator.component.html',
  styleUrls: ['./form-generator.component.css']
})
export class FormGeneratorComponent implements OnInit {
  @Input() fields: (IFormGenerator | IFormGenerator[])[] = [];
  @Input() extraData: { key: string, value: any }[] = []
  @Input() url: string = "";
  @Input() id: string | undefined | null;

  @Output() onSubmit = new EventEmitter();

  @Input() existingObjectUrl: string = "";
  @Input() submitButtonText: string = "Submit";
  @Input() resetButtonText: string = "Reset";
  @Input() formType: "submit" | "filter" = "submit";
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
  isFormField = isFormField;
  isRow = isRow;

  imageFieldsFiles: Map<string, File> = new Map();
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

  getExistingObject() {
    this.notify.showLoading();
    this.dbService.get<any>(`${this.existingObjectUrl}`).subscribe(
      {
        next: data => {
          if (this.autoGenerateFields) {
            this.fields = [];
            const source = this.autoGenerateFieldsKey ? data.data[this.autoGenerateFieldsKey] : data.data;
            this.fields = generateFormFieldsFromObject(source, this.autoGenerateFieldsExclude);
          } //if autoGenerateFields is true, the fields will be generated from the data
          //for each key, find the corresponding field and set the value
          else {
            this.fields.map(field => {
              if (this.isFormField(field)) {
                field.value = data.data[field.name] === "null" ? null : data.data[field.name];
              }
              else if (this.isRow(field)) {
                field.map(rowField => {
                  rowField.value = data.data[rowField.name] === "null" ? null : data.data[rowField.name];
                })
              }
            })
          }

          this.notify.hideLoading();
          this.retainExtraFields.forEach(field => {
            //check if there's already an extra data object with a key matching the field
            const index = this.extraData.findIndex(data => data.key === field);
            if (index > -1) {
              this.extraData[index].value = data.data[field];
            }
            else {
              this.extraData.push({ key: field, value: data.data[field] })
            }
          });

        },
        error: error => {
          this.notify.failNotification("Error loading data. Please try again")
        }
      })
  }

  generateFilterUrl() {
    let params: string[] = [];
    const allFields = this.fields.flat();
    allFields.forEach(field => {
      if (field.value) { params.push(`${field.name}=${field.value}`); }



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
    const allFields = this.fields.flat();
    console.log(allFields)
    this.notify.showLoading();
    const data = new FormData();
    allFields.forEach(field => {


      if (field.type === "date") {
        data.append(field.name, this.formatDate(field.value) || "");
      }
      else { data.append(field.name, field.value || ""); }
    });
    this.extraData.forEach(item => {
      data.append(item.key, item.value)
    });
    let dbCall = this.dbService.post<any>(this.url, data)
    if (this.id) {
      data.append("id", this.id)
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

  showOrHide() {
    this.show = !this.show
  }

  validateForm(fields: IFormGenerator[]): boolean {
    for (const field of fields) {
      console.log(field)
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
    console.log('Files selected:', field.name);
    if (files.length > 0) {
      field.value = files[0];
      this.imageFieldsFiles.set(field.name, files[0]);
    }
  }

  private uploadFiles() {
    const uploadUrl = 'file-server/new/practitioners_images';
    this.fileUploadService.uploadFiles(this.imageFieldsFiles, uploadUrl)
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
          this.submit();
        },
        error: (error) => {
          console.error('Error uploading files', error);
        }
      });
  }


}
