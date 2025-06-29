import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

@Component({
  selector: 'app-set-results',
  templateUrl: './set-results.component.html',
  styleUrls: ['./set-results.component.scss']
})
export class SetResultsComponent implements OnInit {
  @Input() urlFilters: string = '';
  can_edit: boolean = false;
  can_delete: boolean = false;

  baseUrl: string = `examinations/registrations?result=--Null--`;
  url: string = "examinations/registrations?result=--Null--";
  @Input() ts: string = "";
  destroy$: Subject<boolean> = new Subject();
  filters: IFormGenerator[] = [];
  queryParams: { [key: string]: string } = {};
  selectedItems: ExaminationRegistrationObject[] = [];
  specialClasses: Record<string, string> = {};
  @Output() onResultChanged = new EventEmitter<boolean>();
  @Input() examination: ExaminationObject | null = null;
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

    this.url = `${this.baseUrl}` + "&" + this.urlFilters + "&" + Object.entries(this.queryParams).map(([key, value]) => `${key}=${value}`).join("&");
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


    return [];
  }
  updateTimestamp(): void {
    this.ts = new Date().getTime().toString();
  }
  setSelectedItems(objects: ExaminationRegistrationObject[]): void {
    this.selectedItems = objects;
  }

  setResults() {
    if (this.selectedItems.length === 0) {
      this.notify.failNotification("Please select at least one registration to set results for.");
      return;
    }
    if (!this.examination) {
      this.notify.failNotification("Please select an examination to set results for.");
      return;
    }
    const resultDialogRef = this.dialog.open(SetResultsDialogComponent, {
      data: { registrations: this.selectedItems, examination: this.examination },
      width: '90%',
      maxHeight: '90%',
    })

    resultDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onResultChanged.emit(true)
        this.updateTimestamp();
      }
    })
  }




  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
