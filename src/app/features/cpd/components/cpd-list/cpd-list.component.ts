import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';
import { DateService } from 'src/app/core/date/date.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { CpdService } from '../../cpd.service';
import { CpdObject } from '../../models/cpd_model';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { AppService } from 'src/app/app.service';
import { Subject, take, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cpd-list',
  templateUrl: './cpd-list.component.html',
  styleUrls: ['./cpd-list.component.scss']
})
export class CpdListComponent implements OnInit, OnDestroy {
  can_edit: boolean = false;
  can_delete: boolean = false;

  baseUrl: string = `cpd/details`;
  year: string = "";
  url: string = "";
  @Input() ts: string = "";
  @Input() providerUuid: string = "";
  destroy$: Subject<boolean> = new Subject();
  filters: IFormGenerator[] = [];
  queryParams: { [key: string]: string } = {};
  constructor(private cpdService: CpdService, private appService: AppService,
    private notify: NotifyService, private authService: AuthService, private ar: ActivatedRoute, private router: Router) {
    if (this.authService.currentUser?.permissions.includes("Cpd.Content.Edit")) {
      this.can_edit = true;
    }
    if (this.authService.currentUser?.permissions.includes("Cpd.Content.Delete")) {
      this.can_delete = true;
    }
    const date = new Date();
    this.year = date.getFullYear().toString();
  }


  getActions = (object: CpdObject): DataActionsButton[] => {
    const actions: DataActionsButton[] = [
      { label: "View", type: "link", link: `cpd/details`, linkProp: 'uuid' },
      { label: "Manage Attendance", type: "link", link: `cpd/attendance`, linkProp: 'uuid' },
      { label: "View Provider", type: "link", link: `cpd/providers`, linkProp: 'provider_uuid' },
      { label: "Edit", type: "link", link: `cpd/edit`, linkProp: 'uuid' },
      { label: "Delete", type: "button", onClick: (object: CpdObject) => this.delete(object) }
    ];

    return actions;
  }
  updateTimestamp(): void {
    this.ts = new Date().getTime().toString();
  }
  setSelectedItems(objects: CpdObject[]): void {
    // console.log(objects);
  }
  specialClasses: Record<string, string> = {};


  ngOnInit(): void {
    this.ar.queryParams
      .pipe(takeUntil(this.destroy$)).subscribe(params => {

        this.queryParams = params;
        this.appService.appSettings.pipe(take(1)).subscribe(data => {
          this.filters = data?.cpdFilterFields;
          this.filters.forEach(filter => {
            filter.value = params[filter.name];
          });
          this.updateUrl();
        })
      });



  }

  updateUrl() {

    this.url = `${this.baseUrl}` + "?" + Object.entries(this.queryParams).map(([key, value]) => `${key}=${value}`).join("&");
  }



  delete(object: CpdObject) {
    if (!window.confirm('Are you sure you want to delete this CPD topic? You will not be able to restore it. Note that you cannot delete a topic with associated CPD attendance')) {
      return;
    }
    this.cpdService.deleteCpd(object).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
        this.updateTimestamp();
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
    this.router.navigate(['cpd/list_cpd'], { queryParams: paramsObject });

  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }


}
