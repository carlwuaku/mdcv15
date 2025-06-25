import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { ExaminationRegistrationObject } from '../../models/examination-registration.model';
import { ExaminationService } from '../../examination.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';
import { SetResultsDialogComponent } from '../set-results-dialog/set-results-dialog.component';
import { ExaminationObject } from '../../models/examination.model';
import { PrepMessagingComponent } from 'src/app/shared/components/prep-messaging/prep-messaging.component';
import { LoadDataListComponent } from 'src/app/shared/components/load-data-list/load-data-list.component';
import { isEmpty, openHtmlInNewWindow } from 'src/app/shared/utils/helper';
import { SetCustomLetterComponent } from '../set-custom-letter/set-custom-letter.component';
import { TableLegendType } from 'src/app/shared/components/table/tableLegend.model';
@Component({
  selector: 'app-pass-fail-list',
  templateUrl: './pass-fail-list.component.html',
  styleUrls: ['./pass-fail-list.component.scss']
})
export class PassFailListComponent implements OnInit {
  @Input() urlFilters: string = '';
  can_edit: boolean = false;
  can_delete: boolean = false;

  baseUrl: string = `examinations/registrations`;
  url: string = "examinations/registrations";
  @Input() ts: string = "";
  destroy$: Subject<boolean> = new Subject();
  filters: IFormGenerator[] = [];
  queryParams: { [key: string]: string } = {};
  selectedItems: ExaminationRegistrationObject[] = [];
  specialClasses: Record<string, string> = {};

  @Input() examination: ExaminationObject | null = null;
  @ViewChild('prepAllMessage') prepMessageComponent!: PrepMessagingComponent
  @ViewChild('prepNewlyPublishedMessage') prepNewlyPublishedMessage!: PrepMessagingComponent
  @ViewChild('list') loadDataList!: LoadDataListComponent;
  @Output() onResultDeleted = new EventEmitter<boolean>();

  constructor(private service: ExaminationService, private authService: AuthService,
    private notify: NotifyService, private dialog: MatDialog) {
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

    this.url = `${this.baseUrl}` + "?" + this.urlFilters + Object.entries(this.queryParams).map(([key, value]) => `${key}=${value}`).join("&");
  }

  tableClassRules = {
    'bg-light-yellow': (row: ExaminationRegistrationObject) => isEmpty(row.publish_result_date),
    'bg-light-blue': (row: ExaminationRegistrationObject) => !isEmpty(row.publish_result_date)
  };

  tableLegends: TableLegendType[] = [
    { classrule: 'bg-light-yellow', label: 'Not published' },
    { classrule: 'bg-light-blue', label: 'Published' },
  ]




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

  getActions = (object: ExaminationRegistrationObject): DataActionsButton[] => {
    const actions: DataActionsButton[] = [
      { label: "View/Print registration letter", type: "button", onClick: (object: ExaminationRegistrationObject) => this.printRegistrationLetter(object, "registration") },
      { label: "View/Print result letter", type: "button", onClick: (object: ExaminationRegistrationObject) => this.printRegistrationLetter(object, "result") },
      { label: "Set custom registration letter", type: "button", onClick: (object: ExaminationRegistrationObject) => this.setCustomRegistrationLetter(object) },
      { label: "Set custom result letter", type: "button", onClick: (object: ExaminationRegistrationObject) => this.setCustomResultLetter(object) },
      ...(object.registration_letter ? [{ label: "Remove registration letter", type: "button" as "button", onClick: (object: ExaminationRegistrationObject) => this.removeCustomLetter(object, "registration") }] : []),
      ...(object.result_letter ? [{ label: "Remove result letter", type: "button" as "button", onClick: (object: ExaminationRegistrationObject) => this.removeCustomLetter(object, "result") }] : []),
      ...(object.result ? [{ label: "Delete result", type: "button" as "button", onClick: (object: ExaminationRegistrationObject) => this.deleteResult(object) }] : []),
    ];

    return actions;

  }
  /**
   * Update the timestamp string to the current time in milliseconds.
   * This is used to trigger a reload of the data list.
   */
  updateTimestamp(): void {
    this.ts = new Date().getTime().toString();
  }
  setSelectedItems(objects: ExaminationRegistrationObject[]): void {
    this.selectedItems = objects;
  }

  onResultPublished() {
    this.updateTimestamp();
    //ask to send emails to the candidates
    const published = this.selectedItems.slice();
    this.loadDataList.clearSelection();
    this.prepNewlyPublishedMessage.objects = published;

    this.prepNewlyPublishedMessage.emailField = "email";
    this.prepNewlyPublishedMessage.labelField = "first_name, last_name";
    this.prepNewlyPublishedMessage.prepMailList();
    this.prepNewlyPublishedMessage.openDialog();

  }

  deleteResult(object: ExaminationRegistrationObject) {
    if (!window.confirm(`Are you sure you want to remove the result for ${object.index_number}?`)) {
      return;
    }

    this.service.removeResults(object.uuid!).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
        this.updateTimestamp();
        this.onResultDeleted.emit(true)
      },
      error: error => { }
    })
  }

  setCustomRegistrationLetter(object: ExaminationRegistrationObject) {
    this.dialog.open(SetCustomLetterComponent, {
      data: { registration: object, letterType: 'registration' },
      width: '90%',
      maxHeight: '90%',
    })
  }

  setCustomResultLetter(object: ExaminationRegistrationObject) {
    this.dialog.open(SetCustomLetterComponent, {
      data: { registration: object, letterType: 'result' },
      width: '90%',
      maxHeight: '90%',
    })
  }

  removeCustomLetter(object: ExaminationRegistrationObject, type: "registration" | "result") {
    if (!window.confirm(`Are you sure you want to remove the ${type} letter for ${object.index_number}?`)) {
      return;
    }
    this.service.removeCustomLetter(object.id!, type).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
        this.updateTimestamp();
      },
      error: error => { }
    })
  }

  printRegistrationLetter(object: ExaminationRegistrationObject, letterType: "registration" | "result") {
    this.service.getCandidateLetter(object.uuid!, letterType).subscribe({
      next: response => {
        openHtmlInNewWindow(response)

      },
      error: error => {
        this.notify.failNotification("Failed to load registration letter");
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
