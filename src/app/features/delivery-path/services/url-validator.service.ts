import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { setHireOrderId, setMobNumber, setUrlParams } from '../state/delivery-path.actions';
import { BehaviorSubject } from 'rxjs';
import { UrlValidationStates } from '../models/hire-tracker-response.model';

@Injectable({
  providedIn: 'root'
})
export class UrlValidatorService {
  urlValidationState: BehaviorSubject<UrlValidationStates> = new BehaviorSubject<UrlValidationStates>(UrlValidationStates.Running);

  constructor(private store: Store) { 
    let url = window.location.href;
    //do a simple check for a valid url. if no ? is detected, do not make the call. display an error message.
    if (url.split("?").length === 2) {
      //if there are 2 parts, let the API validate the id and signature
      this.urlValidationState.next(UrlValidationStates.Valid);
      let urlParams = url.split("?");
      //set the urlparams
      this.store.dispatch(setUrlParams({ params: urlParams[1] }));
      //get the hire order id and mob id
      const idPart = urlParams[1].split("&").find(val => val.includes("id="));
      //id is in the format x-hire_order_id-mob_id
      const idSegments = idPart?.split("-");
      const hireOrderId = idSegments ? idSegments[1] : "-";
      const mobId = idSegments ? idSegments[2] : "-";

      this.store.dispatch(setHireOrderId({params: hireOrderId}));
      this.store.dispatch(setMobNumber({params: mobId}));
    }
    else {
      this.urlValidationState.next(UrlValidationStates.Invalid)
    }

  }
}

