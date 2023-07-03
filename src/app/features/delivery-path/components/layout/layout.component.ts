import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { HireTrackerResponse } from 'src/app/features/delivery-path/models/hire-tracker-response.model';
import { DeliveryPathFacade } from '../../state/delivery-path.facade';
import { Observable } from 'rxjs';
import { RemoteData } from 'ngx-remotedata';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  hireDetails!: HireTrackerResponse;
  machineCode?: string;

  constructor(
    private deliveryFacade: DeliveryPathFacade) { }

  apiResponse$: Observable<RemoteData<HireTrackerResponse, Error>> =
    this.deliveryFacade.getDeliveryPathDataApiResponse$;

  ngOnInit() {
    this.apiResponse$.subscribe(data => {
      if (data.tag === "Success") {
        this.hireDetails = data.value;

        if (!!this.hireDetails.orderDetail.eCode) {
          this.machineCode = this.hireDetails.orderDetail.eCode;
        } else this.machineCode = this.hireDetails.orderDetail.itemCode;
      }
    })
  }
}
