import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/core/services/http/http.service';
import { EmailQueueObject } from './models/email_queue_model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  constructor(private dbService: HttpService) { }

  deleteQueueItems(ids: number[]): Observable<{ message: string }> {
    return this.dbService.delete<{ message: string }>(`email/queue`, { ids });
  }

  retryQueueItems(ids: number[]): Observable<{ message: string }> {
    return this.dbService.put<{ message: string }>(`email/queue/retry`, { ids });
  }
}
