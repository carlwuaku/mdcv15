import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';
import { getToday } from 'src/app/shared/utils/dates';
import { RenewalService } from '../../../renewal.service';
import { RenewalObject } from '../renewal.model';
import { take } from 'rxjs';
import { DataListComponentInterface } from 'src/app/shared/types/DataListComponentInterface';

@Component({
  selector: 'app-renewal-list',
  templateUrl: './renewal-list.component.html',
  styleUrls: ['./renewal-list.component.scss']
})
export class RenewalListComponent implements DataListComponentInterface<RenewalObject>, OnInit, OnChanges {
  @Input() url: string = "";
  baseUrl: string = "";

  selectedItems: RenewalObject[] = [];

  @Input() licenseType: string = "";
  @Input() licenseMode: boolean = false;
  ts: string = "";
  @Output() onSelectedItemsChange = new EventEmitter<RenewalObject[]>();
  constructor(private authService: AuthService, private notify: NotifyService, public dialog: MatDialog,
    private renewalService: RenewalService, private ar: ActivatedRoute, private router: Router,
    private appService: AppService) {

  }

  ngOnInit(): void {

  }

  ngOnChanges(): void {

  }

  setSelectedItems(objects: RenewalObject[]): void {
    this.selectedItems = objects;
    this.onSelectedItemsChange.emit(objects);
  }
  specialClasses: Record<string, string> = {};


  getActions = (object: RenewalObject): DataActionsButton[] => {

    const actions: DataActionsButton[] = [
      { label: "Edit", type: "link", link: `licenses/renewal-form/`, linkProp: 'uuid' },
      { label: "Delete", type: "button", onClick: (object: RenewalObject) => this.delete(object) }
    ];
    if (!this.licenseMode) {
      actions.unshift(
        { label: "View license", type: "link", link: `licenses/license-details/`, linkProp: 'license_uuid' }
      )
    }


    return actions;
  }
  delete(object: RenewalObject) {
    this.renewalService.delete(object.uuid).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
        this.updateTimestamp();
      },
      error: error => { }
    })
  }

  public updateTimestamp() {
    this.ts = getToday("timestamp_string");
  }

  update(object: RenewalObject, data: { [key: string]: string }) {
    if (!window.confirm('Are you sure you want to update this entry? ')) {
      return;
    }
    this.renewalService.update(object.uuid, data).subscribe({
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
    paramsObject['license_type'] = this.licenseType;


    this.router.navigate([`licenses/renewals/${this.licenseType}`], { queryParams: paramsObject });

  }




  public reload() {
    this.updateTimestamp();
  }
}
