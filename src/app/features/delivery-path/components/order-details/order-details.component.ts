import { Component, Input, OnInit } from '@angular/core';
import { HireTrackerResponse, OrderDetail } from '../../models/hire-tracker-response.model';
import { Observable } from 'rxjs';
import { RemoteData } from 'ngx-remotedata';
import { DeliveryPathFacade } from '../../state/delivery-path.facade';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  orderDetail!: OrderDetail;
  movementType!: string;
  movementLabel!: string;

  constructor (private deliveryFacade: DeliveryPathFacade) { }

  apiResponse$: Observable<RemoteData<HireTrackerResponse, Error>> =
    this.deliveryFacade.getDeliveryPathDataApiResponse$;
  getAppStatus$: Observable<string> = this.deliveryFacade.getAppStatus$;

  ngOnInit(): void {
    this.apiResponse$.subscribe(data => {
      if (data.tag === "Success") {
        this.orderDetail = data.value.orderDetail;
      }
      this.getAppStatus$.subscribe(data => {
        this.movementType = data;
      })
    })

    if (this.movementType === "Delivery") {
      this.movementLabel = "Delivery to: ";
    } else this.movementLabel = "Collection from: ";
  }
}
