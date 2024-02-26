import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpService } from 'src/app/core/services/http/http.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { PractitionerObject } from '../../../models/practitioner_model';
import { PractitionerWorkHistory } from '../work_history_model';
@Component({
  selector: 'app-edit-work-history',
  templateUrl: './edit-work-history.component.html',
  styleUrls: ['./edit-work-history.component.scss']
})
export class EditWorkHistoryComponent {
  formUrl: string = "practitioners/workhistory";
  existingUrl: string = "practitioners/workhistory";
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
      label: "Position",
      name: "position",
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
      label: "Institution Type",
      name: "institution_type",
      hint: "",
      options: [
      ],
      type: "api",
      value: "",
      required: false,
      api_url: "admin/settings/Doctors.work_institution_types",
      apiKeyProperty: "name",
      apiLabelProperty: "name",
      apiType: "datalist",
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
    public dialogRef: MatDialogRef<EditWorkHistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { object: PractitionerWorkHistory | null, practitioner: PractitionerObject },

  ) {
    this.extraFormData = [
      { key: "registration_number", value: data.practitioner.registration_number },
    ];
    if (data.object) {
      this.extraFormData.push({ key: "uuid", value: data.object.uuid }
      );
      this.id = data.object.uuid;
      this.existingUrl = "practitioners/workhistory/" + this.id;
      this.formUrl = "practitioners/workhistory/" + this.id;
    }



  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  formSubmitted(args: boolean) {
    this.dialogRef.close(true);
  }
}
