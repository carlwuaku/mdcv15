import { Component, OnInit } from '@angular/core';
import { DeliveryPathFacade } from '../../state/delivery-path.facade';
import { RemoteData } from 'ngx-remotedata';
import { Observable } from 'rxjs';
import { HireTrackerResponse } from '../../models/hire-tracker-response.model';
import { AnalyticsService } from 'src/app/core/services/analytics/analytics.service';
@Component({
  selector: 'app-need-help',
  templateUrl: './need-help.component.html',
  styleUrls: ['./need-help.component.scss']
})
export class NeedHelpComponent implements OnInit {
  apiResponse$: Observable<RemoteData<HireTrackerResponse, Error>> =
  this.deliveryFacade.getDeliveryPathDataApiResponse$;

  message:string = "";
  email:string = "";
  phone: string = "";
  constructor(
    private deliveryFacade: DeliveryPathFacade,
    private analyticsService: AnalyticsService) {
  }

  ngOnInit(): void {
    //we're taking advantage of the fact that this component is
    //only rendered if the apiresponse is successful from the deliverypage component.
    //thus we can safely skip any checks for errors
    this.apiResponse$.subscribe(data => {
      if (data.tag === "Success") {
        this.message = data.value.needhelp.message;
        this.phone = data.value.needhelp.phoneNumber;
        this.email = data.value.needhelp.email;
      }
    })
  }

  gaEvent(eventName: string, eventCat: string, eventAction: string, eventLabel: string, eventValue: number) {
    this.analyticsService.sendCustomEvent(eventName, eventCat, eventAction, eventLabel, eventValue);
  }
}
