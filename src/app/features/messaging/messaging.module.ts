import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessagingRoutingModule } from './messaging-routing.module';
import { MessagingComponent } from './messaging.component';
import { SendEmailComponent } from './send-email/send-email.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { EmailQueueComponent } from './email-queue/email-queue.component';


@NgModule({
  declarations: [
    MessagingComponent,
    SendEmailComponent,
    EmailQueueComponent
  ],
  imports: [
    CommonModule,
    MessagingRoutingModule,
    SharedModule
  ]
})
export class MessagingModule { }
