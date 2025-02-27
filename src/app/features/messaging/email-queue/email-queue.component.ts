import { Component, ViewChild } from '@angular/core';
import { DataListComponentInterface } from 'src/app/shared/types/DataListComponentInterface';
import { EmailQueueObject } from '../models/email_queue_model';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';
import { MessagingService } from '../messaging.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { LoadDataListComponent } from 'src/app/shared/components/load-data-list/load-data-list.component';
import { take } from 'rxjs';

@Component({
  selector: 'app-email-queue',
  templateUrl: './email-queue.component.html',
  styleUrls: ['./email-queue.component.scss']
})
export class EmailQueueComponent implements DataListComponentInterface<EmailQueueObject> {
  @ViewChild('dataList') dataList!: LoadDataListComponent;
  baseUrl: string = `email/queue`;
  url: string = `email/queue`;
  ts: string = "";
  selectedItems: EmailQueueObject[] = [];
  getActions = (object: EmailQueueObject): DataActionsButton[] => {
    return [];
  }
  updateTimestamp(): void {
    this.ts = new Date().getTime().toString();
  }
  setSelectedItems(objects: EmailQueueObject[]): void {
    console.log(objects);
    this.selectedItems = objects;
  }
  specialClasses: Record<string, string> = {};
  can_edit: boolean = false;
  can_delete: boolean = false;
  constructor(private service: MessagingService, private notify: NotifyService) { }

  delete() {
    if (!window.confirm('Are you sure you want to delete the selected items from the queue? You will not be able to restore it')) {
      return;
    }
    const ids = this.selectedItems.map(item => item.id);
    this.service.deleteQueueItems(ids).pipe(take(1)).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
        this.dataList.reload();
      },
      error: error => { }
    })
  }

  retry() {
    const ids = this.selectedItems.map(item => item.id);
    this.service.retryQueueItems(ids).pipe(take(1)).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
        this.dataList.reload();
      },
      error: error => { }
    })
  }

  tableClassRules = {
    'bg-light-green': (row: any) => row.status === 'sent',
    'bg-light-red': (row: any) => row.status === 'failed',
    'bg-light-yellow': (row: any) => row.status === 'pending',
    'bg-light-blue': (row: any) => row.status === 'processing'
  };

}
