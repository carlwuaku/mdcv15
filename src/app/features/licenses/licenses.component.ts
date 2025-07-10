import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LicenseObject } from './models/license_model';
import { HttpService } from 'src/app/core/services/http/http.service';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';
import { getToday } from 'src/app/shared/utils/dates';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { MatDialog } from '@angular/material/dialog';
import { EditImageComponent } from 'src/app/shared/components/edit-image/edit-image.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { Subject, take, takeUntil } from 'rxjs';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { LoadDataListComponent } from 'src/app/shared/components/load-data-list/load-data-list.component';
@Component({
  selector: 'app-licenses',
  templateUrl: './licenses.component.html',
  styleUrls: ['./licenses.component.scss']
})
export class LicensesComponent implements OnInit, OnDestroy, AfterViewInit {

  baseUrl: string = "licenses/details";
  @Input() url: string = "licenses/details";
  ts: string = "";
  @Input() showSearch: boolean = true;
  @Input() licenseType: string = "";
  @Input() showSelectLicenseType: boolean = true;
  @Input() showAddButton: boolean = true;
  destroy$: Subject<boolean> = new Subject();
  filters: IFormGenerator[] = [];
  @ViewChild('dataList') dataList!: LoadDataListComponent;
  queryParams: { [key: string]: string } = {};
  selectedItems: LicenseObject[] = [];
  constructor(private dbService: HttpService, private notify: NotifyService,
    public dialog: MatDialog, private ar: ActivatedRoute, private appService: AppService,
    private router: Router) {

    this.licenseType = ar.snapshot.params['type'];
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.ar.queryParams
        .pipe(takeUntil(this.destroy$)).subscribe(params => {

          this.queryParams = params;
          if (this.licenseType) {
            this.appService.appSettings.pipe(take(1)).subscribe(data => {
              this.filters = data?.licenseTypes[this.licenseType]?.searchFormFields || [];
              this.filters.forEach(filter => {
                filter.value = params[`child_${filter.name}`];
              });
              this.updateUrl();
              this.dataList?.getData(this.url);
            })

          }
        });
    })
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
  ngOnInit(): void {
    // if (this.licenseType) {
    //   this.updateUrl();
    // }
    // else {

    // }


  }

  // onLicenseTypeChange(selectedValue: string) {
  //   this.router.navigate(['licenses'], { queryParams: { licenseType: selectedValue } });
  // }

  updateUrl() {

    this.url = `${this.baseUrl}` + "?" + Object.entries(this.queryParams).map(([key, value]) => `${key}=${value}`).join("&");
  }
  getActions = (license: LicenseObject): DataActionsButton[] => {

    const actions: DataActionsButton[] = [

    ];

    if (license.deleted_at) {
      actions.push(
        { label: "Restore", type: "button", onClick: (license: LicenseObject) => this.activate(license) }
      )
    }
    else {
      actions.push(
        { label: "View", type: "link", link: `licenses/license-details/`, linkProp: 'uuid' },
        { label: "Edit", type: "link", link: `licenses/form/update/${license.type}`, linkProp: 'uuid' },
        { label: "Edit picture", type: "button", onClick: (license: LicenseObject) => this.editImage(license) },
        { label: "Delete", type: "button", onClick: (role: LicenseObject) => this.delete(role) }
      )
    }
    return actions;
  }

  editImage(license: LicenseObject) {
    const dialogRef = this.dialog.open(EditImageComponent, {
      data: {
        uuid: license.uuid, picture: license.picture, name: license.name,
        unique_id: license.license_number, updateUrl: "licenses/details"
      },
      minWidth: "40vw"
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateTimestamp();
      }
    });
  }

  activate(object: LicenseObject) {
    if (!window.confirm('Are you sure you want to restore this license?')) {
      return;
    }
    this.dbService.put<{ message: string }>("licenses/details/" + object.uuid + "/restore", {}).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
        this.updateTimestamp();
      },
      error: error => { }
    })
  }

  delete(license: LicenseObject) {
    if (!window.confirm('Are you sure you want to delete this license? You will be able to restore it')) {
      return;
    }
    this.dbService.delete<{ message: string }>("licenses/details/" + license.uuid).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
        this.updateTimestamp();
      },
      error: error => { }
    })
  }

  updateTimestamp() {
    this.ts = getToday("timestamp_string");
  }

  setSelectedItems(objects: LicenseObject[]) {
    this.selectedItems = objects;
  }

  specialClasses: { [key: string]: string } =
    {
      "in_good_standing-In_Good_Standing": "badge bg-success",
      "in_good_standing-Not_In_Good_Standing": "badge bg-danger",
      "in_good_standing-Pending-Payment": "badge bg-warning",
      "in_good_standing-Pending-Approval": "badge bg-warning",
      "category-Medical": "badge bg-success",
      "category-Dental": "badge bg-info",
      "status-Alive": "badge bg-success",
      "status-Deceased": "badge bg-danger",
      "register_type-Provisional": "badge bg-danger",
      "register_type-Temporary": "badge bg-warning",
      "register_type-Permanent": "badge bg-success",
      "register_type-Full": "badge bg-success",
    }
    ;

  filterSubmitted = (params: string) => {

    //split the params by & and then by =
    const paramsArray = params.split("&");
    const paramsObject: { [key: string]: string } = {};
    paramsArray.forEach(param => {
      const [key, value] = param.split("=");
      paramsObject["child_" + key] = value;
    });

    // paramsObject['licenseType'] = this.licenseType;
    //generate a timestamp to force a refresh
    this.ts = getToday("timestamp_string");
    paramsObject['ts'] = this.ts;

    this.router.navigate([], { queryParams: paramsObject, relativeTo: this.ar });

  }

}
