import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';
import { openHtmlInNewWindow } from 'src/app/shared/utils/helper';
import { ExaminationService } from '../../examination.service';
import { ExaminationApplicationObject } from '../../models/examination-application.model';

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
  @Output() onRegistrationDeleted = new EventEmitter<ExaminationApplicationObject>();
  constructor(private service: ExaminationService, private authService: AuthService, private notify: NotifyService) {
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

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }




}
