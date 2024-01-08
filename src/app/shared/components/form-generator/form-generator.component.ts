import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { IFormGenerator } from './form-generator-interface';
import { AuthService } from 'src/app/core/auth/auth.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { HttpService } from 'src/app/core/services/http/http.service';

@Component({
  selector: 'app-form-generator',
  templateUrl: './form-generator.component.html',
  styleUrls: ['./form-generator.component.css']
})
export class FormGeneratorComponent implements OnInit {
  @Input() fields: IFormGenerator[] = [];
  @Input() extraData: {key:string, value:any}[] = []
  @Input() url: string = "";
  @Input() id: string | undefined | null;

  @Output() onSubmit = new EventEmitter();

  @Input() existingObjectUrl: string = "";
  @Input() submitButtonText: string = "Submit";
  @Input() formType: "submit" | "filter" = "submit";
  @Input() show: boolean = true;
  @Input() enableShowHideButton: boolean = false;
  @Input() formClass: string = "vertical";
  @Input() showHideButtonTitle: string = "form";

  @Output() emitFields = new EventEmitter();
  @Input() numOfRows: number = 3;
  @Input() validationRules:any = {}
  constructor(private notify: NotifyService,
    private dbService: HttpService) { }

  ngOnInit(): void {
    //if an id was provided, get the existing object
    if (this.id) {
      this.getExistingObject()
    }
  }

  getExistingObject() {
    this.notify.showLoading();
    this.dbService.get<any>(`${this.existingObjectUrl}`).subscribe(
      {next: data => {
        //for each key, find the corresponding field and set the value
        this.fields.map(field => {
          field.value = data.data[field.name];
        })
        this.notify.hideLoading();
    },
     error:  error => {
      this.notify.failNotification("Error loading data. Please try again")
    }})
  }

  generateFilterUrl() {
    let params:string[] = [];
    this.fields.forEach(field => {
      if (field.value) { params.push(`${field.name}=${field.value}`); }

    });
    this.onSubmit.emit(params.join("&"));
    this.emitFields.emit(this.fields);
  }

  submit(): void{
    if (!this.validateForm(this.fields)) {
      this.notify.hideLoading();
      return; // Stop submission if validation fails
    }
    this.notify.showLoading();
    const data = new FormData();
    this.fields.forEach(field => {
      if(field.value)
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


    dbCall.subscribe({
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

  setFieldValue(args:any, action: IFormGenerator) {
    action.value = args;
  }

  showOrHide() {
    this.show = !this.show
  }

  validateForm(fields: IFormGenerator[]): boolean {
    for (const field of fields) {
      const rules = this.validationRules[field.name];

      if (rules) {
        if (rules.required && !field.value) {
          this.notify.failNotification(`Field '${field.name}' is required.`);
          return false;
        }

        if (rules.minLength && field.value.length < rules.minLength) {
          this.notify.failNotification(
            `Field '${field.name}' should be at least ${rules.minLength} characters long.`
          );
          return false;
        }

        if (rules.maxLength && field.value.length > rules.maxLength) {
          this.notify.failNotification(
            `Field '${field.name}' should be at most ${rules.maxLength} characters long.`
          );
          return false;
        }

        if (rules.customValidation) {
          // For custom validation rule "fieldsMatch", pass an object with both field values
          if (field.name === 'fieldsMatch') {
            const field1 = fields.find((f) => f.name === 'fieldName1');
            const field2 = fields.find((f) => f.name === 'fieldName2');
            if (!rules.customValidation({ fieldName1: field1, fieldName2: field2 })) {
              this.notify.failNotification(
                `Fields '${field1?.name}' and '${field2?.name}' should match.`
              );
              return false;
            }
          } else if (!rules.customValidation(field.value)) {
            this.notify.failNotification(
              `Field '${field.name}' does not meet custom validation criteria.`
            );
            return false;
          }
        }

        // Add more validation rules as needed
      }
    }

    return true; // Form is valid
  }
}
