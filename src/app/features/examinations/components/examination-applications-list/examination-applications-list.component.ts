import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';
import { openHtmlInNewWindow } from 'src/app/shared/utils/helper';
import { ExaminationService } from '../../examination.service';
import { ExaminationApplicationObject } from '../../models/examination-application.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogFormComponent } from 'src/app/shared/components/dialog-form/dialog-form.component';
import { AssignIndexNumbersComponent } from '../assign-index-numbers/assign-index-numbers.component';
import { ExaminationObject } from '../../models/examination.model';
import { PrepMessagingComponent } from 'src/app/shared/components/prep-messaging/prep-messaging.component';

@Component({
  selector: 'app-examination-applications-list',
  templateUrl: './examination-applications-list.component.html',
  styleUrls: ['./examination-applications-list.component.scss']
})
export class ExaminationApplicationsListComponent implements OnInit, OnDestroy {
  @Input() urlFilters: string = '';
  can_edit: boolean = false;
  can_delete: boolean = false;

  baseUrl: string = `examinations/applications`;
  url: string = "examinations/applications";
  @Input() ts: string = "";
  destroy$: Subject<boolean> = new Subject();
  filters: IFormGenerator[] = [];
  queryParams: { [key: string]: string } = {};
  selectedItems: ExaminationApplicationObject[] = [];
  specialClasses: Record<string, string> = {};
  totalRows: number = 0;
  @Output() onRegistrationDeleted = new EventEmitter<ExaminationApplicationObject>();
  @Input() exam: ExaminationObject | undefined;
  @ViewChild('prepMessageComponent') prepMessageComponent!: PrepMessagingComponent
  @Output() onRegistrationAdded = new EventEmitter<ExaminationApplicationObject[]>();
  @Output() onTotalChanged = new EventEmitter<number>();

  constructor(private service: ExaminationService, private authService: AuthService, private notify: NotifyService, private dialog: MatDialog) {
    if (this.authService.currentUser?.permissions.includes("Cpd.Content.Edit")) {
      this.can_edit = true;
    }
    if (this.authService.currentUser?.permissions.includes("Cpd.Content.Delete")) {
      this.can_delete = true;
    }
  }

  ngOnInit() {
    this.updateUrl();
  }

  updateUrl() {

    this.url = `${this.baseUrl}` + "?" + this.urlFilters + "&" + Object.entries(this.queryParams).map(([key, value]) => `${key}=${value}`).join("&");
  }





  delete(object: ExaminationApplicationObject) {
    if (!window.confirm(`Are you sure you want to delete this exam application for ${object.first_name} ${object.last_name}?`)) {
      return;
    }
    this.service.deleteExaminationApplication(object.id!).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
        this.updateTimestamp();
        this.onRegistrationDeleted.emit(object);
      },
      error: error => { }
    })
  }



  filterSubmitted = (params: string) => {

    //split the params by & and then by =
    const paramsArray = params.split("&");
    const paramsObject: { [key: string]: string } = {};
    paramsArray.forEach(param => {
      const [key, value] = param.split("=");
      paramsObject[key] = value;
    });

    this.queryParams = paramsObject;
    this.updateUrl();
  }

  getActions = (object: ExaminationApplicationObject): DataActionsButton[] => {
    const actions: DataActionsButton[] = [

      { label: "Delete", type: "button", onClick: (object: ExaminationApplicationObject) => this.delete(object) }
    ];

    return actions;
  }
  updateTimestamp(): void {
    this.ts = new Date().getTime().toString();
  }
  setSelectedItems(objects: ExaminationApplicationObject[]): void {
    this.selectedItems = objects;
  }

  denySelected() {
    if (!window.confirm("Are you sure you want to deny the selected items?")) {
      return;
    }
    //get the list for emails
    const applicants = this.selectedItems.slice();
    this.service.deleteMultipleApplications(this.selectedItems.map(item => item.id!)).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
        this.sendEmailsToDeniedApplications(applicants);
        this.updateTimestamp();
      },
      error: error => { }
    })
  }



  updateStatus() {
    const dialogRef = this.dialog.open(DialogFormComponent, {
      data: {
        fields: [
          {
            label: "Status",
            name: "status",
            hint: "",
            options: [{ key: "Paid", value: "Paid" }, { key: "Not Paid", value: "Not Paid" }],
            type: "text",
            value: "",
            required: true,
            api_url: "",
            apiKeyProperty: "",
            apiLabelProperty: "",
          }
        ],
        formType: "emit",
        url: "examinations/applications/update-status",
        title: `Update status for ${this.selectedItems.length} selected item(s)`,
      }
    });

    dialogRef.afterClosed().subscribe((result: IFormGenerator[] | false) => {
      if (result) {
        if (!window.confirm("Are you sure you want to update the status for the selected items?")) {
          return;
        }
        const status = result[0].value;
        const data: { id: string, intern_code: string, status: string }[] = [];
        this.selectedItems.forEach(item => {
          data.push({
            id: item.id!,
            intern_code: item.intern_code,
            status: status
          })
        })
        this.service.updateApplicationStatuses(data).subscribe({
          next: response => {
            this.notify.successNotification(response.message);
            this.updateTimestamp();
          },
          error: error => { }
        })
      }
    });
  }

  approveSelected() {
    if (this.selectedItems.length === 0) {
      this.notify.failNotification('Please select at least one application');
      return;
    }
    const registrations = this.selectedItems.map(candidate => {
      return {
        intern_code: candidate.intern_code,
        index_number: '',
        first_name: candidate['first_name'],
        last_name: candidate['last_name'],
        middle_name: candidate['middle_name'],
        phone_number: candidate['phone_number'],
        email: candidate['email'],
        exam_id: this.exam?.id!
      };
    });
    const dialogRef = this.dialog.open(AssignIndexNumbersComponent, {
      width: '600px',
      data: { candidates: registrations, examId: this.exam!.id } // examId should be set appropriately
    });

    dialogRef.afterClosed().subscribe((results: ExaminationApplicationObject[]) => {
      if (results) {
        //send emails to the registrations
        this.sendEmailsToNewlyRegistrered(results);
        this.onRegistrationAdded.emit(results);
        this.service.deleteMultipleApplications(this.selectedItems.map(item => item.id!)).subscribe({
          next: response => {
            this.notify.successNotification(response.message);
            this.updateTimestamp();
          },
          error: error => { }
        })
      }
    });
  }

  sendEmailsToNewlyRegistrered(objects: ExaminationApplicationObject[]) {
    //ask user if they want to send emails
    if (!window.confirm("Send emails to newly registered candidates informing them of their registration?")) {
      return;
    }
    this.prepMessageComponent.objects = objects;
    this.prepMessageComponent.emailField = "email";
    this.prepMessageComponent.labelField = "first_name, last_name";
    this.prepMessageComponent.prepMailList();//uses the objects to get the emails
    this.prepMessageComponent.openDialog();
  }

  sendEmailsToDeniedApplications(objects: ExaminationApplicationObject[]) {
    //ask user if they want to send emails
    if (!window.confirm("Send emails to newly registered candidates informing them of their registration?")) {
      return;
    }
    this.prepMessageComponent.objects = objects;
    this.prepMessageComponent.emailField = "email";
    this.prepMessageComponent.labelField = "first_name, last_name";
    this.prepMessageComponent.prepMailList();//uses the objects to get the emails
    //TODO: pull this data from the system settings or config
    this.prepMessageComponent.setExistingData({
      subject: "Denial of application to write examination"
    })
    this.prepMessageComponent.openDialog();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }




}
