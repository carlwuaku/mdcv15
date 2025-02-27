import { Component } from '@angular/core';
import { DashboardItem } from 'src/app/shared/utils/data';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.scss']
})
export class MessagingComponent {
  menuItems: DashboardItem[] = [
    {
      title: 'Pending Emails',
      url: '/email_queue?status=pending',
      icon: 'mail',
      children: [],
      description: "Manage pending emails",
      apiCountUrl: "/email/queue-count/pending",
      apiCountText: "Pending Emails"
    }
  ]
}
