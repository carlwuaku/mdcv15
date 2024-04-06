import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { IFormGenerator } from './form-generator-interface';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { HttpService } from 'src/app/core/services/http/http.service';
import { take } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-form-generator',
  templateUrl: './form-generator.component.html',
  styleUrls: ['./form-generator.component.css']
})
export class FormGeneratorComponent implements OnInit {
  @Input() fields: IFormGenerator[] = [];
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
  @Input() retainExtraFields:string[] =[];
  constructor(private notify: NotifyService,
    private dbService: HttpService) {
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
          //for each key, find the corresponding field and set the value
          this.fields.map(field => {
            field.value = data.data[field.name] === "null" ? null : data.data[field.name];

            // if(field.value !== "retain"){
            //   this.extraData.push({key: field.name, value: field.value})
            // }
          })
          this.notify.hideLoading();
          this.retainExtraFields.forEach(field => {
            //check if there's already an extra data object with a key matching the field
            const index = this.extraData.findIndex(data => data.key === field);
            if(index > -1){
              this.extraData[index].value = data.data[field];
            }
            else{
              this.extraData.push({key: field, value: data.data[field]})
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
    this.fields.forEach(field => {
      if (field.value) { params.push(`${field.name}=${field.value}`); }

    });
    this.onSubmit.emit(params.join("&"));
    this.emitFields.emit(this.fields);
  }

  submit(): void {
    if (!this.validateForm(this.fields)) {
      this.notify.hideLoading();
      return; // Stop submission if validation fails
    }
    this.notify.showLoading();
    const data = new FormData();
    this.fields.forEach(field => {
      if (field.value)
        data.append(field.name, field.value)
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
        if (field.required && !field.value) {
          this.notify.failNotification(`Field '${field.name}' is required.`);
          return false;
        }

        if (field.value?.trim() && field.minLength && field.value.length < field.minLength) {
          this.notify.failNotification(
            `Field '${field.name}' should be at least ${field.minLength} characters long.`
          );
          return false;
        }

        if (field.maxLength && field.value.length > field.maxLength) {
          this.notify.failNotification(
            `Field '${field.name}' should be at most ${field.maxLength} characters long.`
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
              if(matchField){
                if(field.value != matchField.value){
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
}
