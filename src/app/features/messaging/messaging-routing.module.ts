import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MessagingComponent } from './messaging.component';
import { SendEmailComponent } from './send-email/send-email.component';
import { EmailQueueComponent } from './email-queue/email-queue.component';

const routes: Routes = [{ path: '', component: MessagingComponent },
{ path: 'send_email', component: SendEmailComponent, data: { title: 'Send an email' } },
{ path: 'email_queue', component: EmailQueueComponent, data: { title: 'Manage email queue' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessagingRoutingModule { }
