import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/core/services/http/http.service';
import { RenewalObject } from './components/renewal/renewal.model';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RenewalService {

  constructor(private dbService: HttpService, private notify:NotifyService) {

  }



  delete (uuid: string): Observable<{message:string}> {
    if (!window.confirm('Are you sure you want to delete this renewal record permanently? You will have to create a new one')) {
      return throwError(() => new Error('User cancelled delete'));
    }
    return this.dbService.delete<{message:string}>("practitioners/renewal/" + uuid)
  }
}
