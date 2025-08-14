import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor(private messageService: MessageService, private dialog: MatDialog) { }

  showNotification(message: string, type: "success" | "info" | "warn" | "error", delay?: number) {

    this.messageService.add({
      severity: type, summary: type,
      detail: message
    });
  }
  noConnectionNotification() {
    this.hideLoading()
    this.showNotification("Unable to send data to server. Please try again or contact admin", "error", 3000);
  }

  successNotification(text: string) {
    this.showNotification(text, "success", 3000);
  }

  failNotification(text: string) {
    this.showNotification(text, "error", 3000);
  }

  notPermitted() {
    this.showNotification("You are not permitted to view the page", "error", 3000);
  }

  showLoading() {
    this.messageService.add({
      key: 'loading',
      severity: 'info', summary: 'Loading'
    });
  }

  hideLoading() {
    this.messageService.clear('loading');
  }

  infoNotification(text: string) {
    this.showNotification(text, "info", 3000);
  }

  warningAlertNotification(title: string, text: string) {
    this.dialog.open(DialogComponent, {
      data: {
        title,
        message: text,
        icon: "warning"
      }
    })
  }

}
