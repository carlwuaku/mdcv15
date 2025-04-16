import { Component, EventEmitter, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/core/models/user.model';
import { HttpService } from 'src/app/core/services/http/http.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';
import { getToday } from 'src/app/shared/utils/dates';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  qrCodeUrl: string = "";
  authCode: string = "";
  @ViewChild('twoFaDialog') twoFaDialog!: TemplateRef<any>;
  constructor(private dbService: HttpService, private notify: NotifyService, public dialog: MatDialog) {
    this.updateTimestampEvent.subscribe(() => {
      this.updateTimestamp();
    });
  }
  updateTimestampEvent: EventEmitter<void> = new EventEmitter();
  columnDefs = [
    {
      headerName: '#',
      valueGetter: "node.rowIndex + 1",
      width: 80,
      checkboxSelection: true,
      headerCheckboxSelection: true
    },

    {
      headerName: ' Name', field: 'username', sortable: true, filter: true,

    },
    { headerName: 'Phone', field: 'phone', sortable: true, filter: true },
    { headerName: 'Region', field: 'regionId', sortable: true, filter: true },
    { headerName: 'Active', field: 'active', sortable: true, filter: true }


  ];



  baseUrl: string = "admin/users";
  url: string = "admin/users";
  ts: string = "";

  getActions = (user: User): DataActionsButton[] => {
    const actions: DataActionsButton[] = [];
    if (user.status) {
      actions.push(
        { label: "Activate Account", type: "button", onClick: (user: User) => this.activate(user) }
      )
    }

    else {
      if (user.google_authenticator_setup === "no") {
        actions.push(
          { label: "Enable 2FA", type: "button", onClick: (user: User) => this.enable2FA(user) }
        )
      }
      actions.push(
        { label: "Edit", type: "link", link: `admin/userForm/`, linkProp: 'id' },
        {
          label: "Deactivate Account", type: "button", onClick: (user: User) => this.deactivate(user)
        }

      )
    }
    return actions;
  }

  updateTimestamp() {
    this.ts = getToday("timestamp_string");
  }

  setSelectedItems(users: User[]) { }

  deactivate(user: User) {
    const reason = window.prompt("Please state a reason for deactivating this user");
    const data = reason ? { "reason": reason } : {}
    this.dbService.put<{ message: string }>(`admin/users/${user.id}/deactivate`, data).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
        this.updateTimestamp();
      },
      error: error => { }
    })
  }

  deleteUser(user: User) {
    if (!window.confirm('Are you sure you want to deactivate this user? This will prevent the account from being used until you re-activate it')) {
      return;
    }
    this.dbService.delete<{ message: string }>("admin/users/" + user.id).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
        this.updateTimestamp();
      },
      error: error => { }
    })
  }

  activate(user: User) {
    if (!window.confirm('Are you sure you want to activate this user? This will allow the user to login to the system')) {
      return;
    }
    this.dbService.put<{ message: string }>("admin/users/" + user.id + "/activate", { "active": 1 }).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
        this.updateTimestamp();
      },
      error: error => { }
    })
  }

  enable2FA(user: User) {
    const data = new FormData();
    data.append("uuid", user.uuid);
    this.dbService.post<{ message: string, secret: string, qr_code_url: string }>("admin/users/setup-google-auth",
      data).subscribe({
        next: response => {
          this.qrCodeUrl = response.qr_code_url;
          this.dialog.open(this.twoFaDialog).afterClosed().subscribe((data: string) => {
            if (!data) {
              this.authCode = "";
              this.qrCodeUrl = "";
              return;
            }
            this.submit2FA(user.uuid, this.authCode);
          })
        },
        error: error => { }
      })
  }

  submit2FA(userId: string, code: string) {
    this.notify.showLoading();
    const data = new FormData();
    data.append("uuid", userId);
    data.append("code", code);
    this.dbService.post<{ message: string }>("admin/users/verify-google-auth",
      data).subscribe({
        next: response => {
          this.notify.successNotification(response.message);
          this.updateTimestamp();
          this.qrCodeUrl = "";
          this.authCode = "";
          this.dialog.closeAll();
          this.notify.hideLoading();
        },
        error: error => {
          this.notify.hideLoading();
          this.qrCodeUrl = "";
          this.authCode = "";
        }
      })
  }


}
