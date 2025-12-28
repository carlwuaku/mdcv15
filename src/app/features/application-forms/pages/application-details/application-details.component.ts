import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationFormService } from '../../application-form.service';
import { take } from 'rxjs';
import { ApplicationFormObject } from '../../models/application-form.model';
import { IFormGenerator, isFormField, isRow } from 'src/app/shared/components/form-generator/form-generator-interface';

@Component({
  selector: 'app-application-details',
  templateUrl: './application-details.component.html',
  styleUrls: ['./application-details.component.scss']
})
export class ApplicationDetailsComponent implements OnInit {
  id: string;
  data: ApplicationFormObject | null = null;
  loading = false;
  error: string | null = null;
  formTemplate: IFormGenerator[] | null = null;
  isFormField = isFormField;
  isRow = isRow;
  constructor(private ar: ActivatedRoute, private applicationService: ApplicationFormService) {
    this.id = ar.snapshot.params['id'];
  }
  ngOnInit(): void {
    this.loadData();
  }


  loadData = () => {
    return this.applicationService.getApplicationDetails(this.id)
  }

  setData(data: ApplicationFormObject) {
    this.data = data;
    this.formTemplate = data?.template
    if (this.formTemplate) {
      this.fillFieldsWithExistingData(data.form_data);
    }
  }

  public fillFieldsWithExistingData(source: Record<string, any>) {
    this.formTemplate!.map(field => {

      if (this.isRow(field)) {
        field.map((rowField: { value: any; name: string | number; }) => {
          rowField.value = source[rowField.name] === "null" ? null : source[rowField.name];
        })
      } else if (this.isFormField(field)) {
        field.value = source[field.name] === "null" ? null : source[field.name] ?? "";
      }
    })
  }

}


