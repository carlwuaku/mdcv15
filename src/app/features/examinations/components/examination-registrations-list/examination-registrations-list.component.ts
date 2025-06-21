import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ExaminationRegistrationObject } from '../../models/examination-registration.model';
import { ExaminationService } from '../../examination.service';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { AuthService } from 'src/app/core/auth/auth.service';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';
import { openHtmlInNewWindow } from 'src/app/shared/utils/helper';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { MatDialog } from '@angular/material/dialog';
import { SetCustomLetterComponent } from '../set-custom-letter/set-custom-letter.component';

@Component({
  selector: 'app-examination-registrations-list',
  templateUrl: './examination-registrations-list.component.html',
  styleUrls: ['./examination-registrations-list.component.scss']
})
export class ExaminationRegistrationsListComponent implements OnInit, OnDestroy {
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
  @Output() onRegistrationDeleted = new EventEmitter<ExaminationRegistrationObject>();
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



  delete(object: ExaminationRegistrationObject) {
    if (!window.confirm(`Are you sure you want to delete this exam registration for ${object.index_number}?`)) {
      return;
    }
    this.service.deleteExaminationRegistration(object.uuid!).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
        this.updateTimestamp();
        this.onRegistrationDeleted.emit(object);
      },
      error: error => { }
    })
  }

  printRegistrationLetter(object: ExaminationRegistrationObject) {
    this.service.getCandidateRegistrationLetter(object.uuid!).subscribe({
      next: response => {
        openHtmlInNewWindow(response)

      },
      error: error => {
        this.notify.failNotification("Failed to load registration letter");
      }
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

  getActions = (object: ExaminationRegistrationObject): DataActionsButton[] => {
    const actions: DataActionsButton[] = [
      { label: "View/Print registration letter", type: "button", onClick: (object: ExaminationRegistrationObject) => this.printRegistrationLetter(object) },
      { label: "View/Print result letter", type: "link", link: `cpd/attendance`, linkProp: 'uuid' },
      { label: "Set custom registration letter", type: "button", onClick: (object: ExaminationRegistrationObject) => this.setCustomRegistrationLetter(object) },
      { label: "Set custom result letter", type: "button", onClick: (object: ExaminationRegistrationObject) => this.setCustomResultLetter(object) },
      ...(object.registration_letter ? [{ label: "Edit", type: "button" as "button", onClick: (object: ExaminationRegistrationObject) => this.removeCustomLetter(object, "registration") }] : []),
      ...(object.result_letter ? [{ label: "Edit", type: "button" as "button", onClick: (object: ExaminationRegistrationObject) => this.removeCustomLetter(object, "result") }] : []),

      { label: "Delete", type: "button", onClick: (object: ExaminationRegistrationObject) => this.delete(object) }
    ];

    return actions;
  }
  updateTimestamp(): void {
    this.ts = new Date().getTime().toString();
  }
  setSelectedItems(objects: ExaminationRegistrationObject[]): void {
    this.selectedItems = objects;
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
    this.service.removeCustomLetter(object.uuid!, type).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
        this.updateTimestamp();
      },
      error: error => { }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }




}
