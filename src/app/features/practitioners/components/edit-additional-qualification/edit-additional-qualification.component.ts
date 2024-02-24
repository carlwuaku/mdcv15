import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpService } from 'src/app/core/services/http/http.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { PractitionerAdditionalQualification } from '../../models/additional_qualification_model';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { PractitionerObject } from '../../models/practitioner_model';

@Component({
  selector: 'app-edit-additional-qualification',
  templateUrl: './edit-additional-qualification.component.html',
  styleUrls: ['./edit-additional-qualification.component.scss']
})
export class EditAdditionalQualificationComponent {
  formUrl: string = "practitioners/qualifications";
  existingUrl: string = "practitioners/qualifications";
  fields: IFormGenerator[] = [
    {
      label: "Institution",
      name: "institution",
      hint: "",
      options: [],
      type: "text",
      value: "",
      required: true
    },
    {
      label: "Qualification",
      name: "qualification",
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
      label: "Start Date",
      name: "start_date",
      hint: "",
      options: [
      ],
      type: "text",
      value: "",
      required: false,
      api_url: "",
      apiKeyProperty: "",
      apiLabelProperty: "",
    },
    {
      label: "End Date",
      name: "end_date",
      hint: "",
      options: [
      ],
      type: "text",
      value: "",
      required: true,
      api_url: "",
      apiKeyProperty: "",
      apiLabelProperty: "",
    }
  ];
  extraFormData: { key: string, value: any }[] = [];
  id: string = "";
  constructor(
    public dialogRef: MatDialogRef<EditAdditionalQualificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { object: PractitionerAdditionalQualification | null, practitioner: PractitionerObject },
    private dbService: HttpService,
    private notify: NotifyService
  ) {
    this.extraFormData = [
      { key: "registration_number", value: data.practitioner.registration_number },
    ];
    if (data.object) {
      this.extraFormData.push({ key: "uuid", value: data.object.uuid }
      );
      this.id = data.object.uuid;
      this.existingUrl = "practitioners/qualifications/" + this.id;
      this.formUrl = "practitioners/qualifications/" + this.id;
    }



  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  formSubmitted(args: boolean) {
    this.dialogRef.close(true);
  }
}
