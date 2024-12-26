import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';
import { AuthService } from 'src/app/core/auth/auth.service';
import { DateService } from 'src/app/core/date/date.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { CpdService } from '../../cpd.service';
import { DataListComponentInterface } from 'src/app/shared/types/DataListComponentInterface';
import { CpdObject } from '../../models/cpd_model';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';

@Component({
  selector: 'app-cpd',
  templateUrl: './cpd.component.html',
  styleUrls: ['./cpd.component.scss']
})
export class CpdComponent implements OnInit {
  //permissions
  can_edit: boolean = false;
  can_delete: boolean = false;

  baseUrl: string = `cpd/details`;
  year: any
  url: string = "";


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

  ts: string = "";

  getActions = (object: CpdObject): DataActionsButton[] => {
    const actions: DataActionsButton[] = [
      { label: "View", type: "link", link: `cpd/details`, linkProp: 'uuid' },
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
    this.url = this.baseUrl + "?year=" + this.year
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
