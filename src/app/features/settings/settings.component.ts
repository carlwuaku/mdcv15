import { Component } from '@angular/core';
import { SettingsObject } from './models/Settings.model';
import { EditSettingsComponent } from './edit-settings/edit-settings.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpService } from 'src/app/core/services/http/http.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';
import { getToday } from 'src/app/shared/utils/dates';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    standalone: false
})
export class SettingsComponent {
  constructor(private dbService: HttpService, private notify: NotifyService, public dialog: MatDialog) { }
  baseUrl: string = "admin/settings";
  url: string = "admin/settings";
  ts: string = "";

  getActions = (object: SettingsObject): DataActionsButton[] => {

    const actions: DataActionsButton[] = [
      { label: "Edit", type: "button", onClick: (object: SettingsObject) => this.edit(object) }
    ];

    return actions;
  }



  edit(object: SettingsObject) {
    const dialogRef = this.dialog.open(EditSettingsComponent, {
      width: '70%',
      data: {...object},
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if(result){
        this.updateTimestamp();
      }

    });
  }



  updateTimestamp() {
    this.ts = getToday("timestamp_string");
  }
}
