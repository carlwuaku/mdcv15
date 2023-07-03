import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HireTrackerResponse } from '../models/hire-tracker-response.model';
import { ProofImageResponse } from '../models/proof-image-model';
import { HttpService } from '../../../core/services/http/http.service';

@Injectable({
  providedIn: 'root',
})
export class DeliveryPathHttpService {
  constructor(private http: HttpService) {}

  getCollectionData(urlParams:string): Observable<HireTrackerResponse> {
    return this.http.get<HireTrackerResponse>(`my-delivery?${urlParams}`);
  }

  /**
   * get the proof of delivery/collection images for an order
   * @param urlParams the ?id=...&sig... for the order
   * @param type whether delivery or collection
   * @returns Observable of ProofImage objects array
   */
  getProofImages(urlParams:string, type:string): Observable<ProofImageResponse> {
    const imageType = type.toLocaleLowerCase() === "delivery" ? "delivery": "collection";
    return this.http.get<ProofImageResponse>(`my-delivery/images/${imageType}?${urlParams}`)
  }
}
