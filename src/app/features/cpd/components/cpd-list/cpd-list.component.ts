import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';
import { DateService } from 'src/app/core/date/date.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { CpdService } from '../../cpd.service';
import { CpdObject } from '../../models/cpd_model';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';

@Component({
    selector: 'app-cpd-list',
    templateUrl: './cpd-list.component.html',
    styleUrls: ['./cpd-list.component.scss'],
    standalone: false
})
export class CpdListComponent implements OnInit {
  can_edit: boolean = false;
  can_delete: boolean = false;

  baseUrl: string = `cpd/details`;
  year: string = "";
  url: string = "";
  @Input() ts: string = "";
  @Input() providerUuid: string = "";

  constructor(private cpdService: CpdService, private dateService: DateService,
    private notify: NotifyService, private authService: AuthService) {
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
    console.log(objects);
  }
  specialClasses: Record<string, string> = {};


  ngOnInit(): void {
    this.setUrl();
  }

  setUrl(): void {
    this.url = this.baseUrl;
    let conditions = [];
    if (this.year.trim()) {
      conditions.push(`year=${this.year}`);
    }

    if (this.providerUuid) {
      conditions.push("provider_uuid=" + this.providerUuid);
    }
    if (conditions.length) {
      this.url += `?${conditions.join('&')}`;
    }
    console.log(this.url);
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
}
