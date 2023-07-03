import { Component, Input, OnInit } from '@angular/core';
import { BlueStates, CollectionStatus, DefaultProblemStates, DeliveryStatus, GreenStates, HireTrackerResponse } from '../../models/hire-tracker-response.model';
import { Observable } from 'rxjs';
import { RemoteData } from 'ngx-remotedata';
import { DeliveryPathFacade } from '../../state/delivery-path.facade';
import { AnalyticsService } from 'src/app/core/services/analytics/analytics.service';

@Component({
  selector: 'app-status-icon',
  templateUrl: './status-icon.component.html',
  styleUrls: ['./status-icon.component.scss']
})
export class StatusIconComponent implements OnInit {
  apiResponse$: Observable<RemoteData<HireTrackerResponse, Error>> =
    this.deliveryFacade.getDeliveryPathDataApiResponse$;
  getAppStatus$: Observable<string> = this.deliveryFacade.getAppStatus$;

  showIconName: boolean = true;
  phone: string = "";
  iconName: string = "";
  problemMessage: string = "";
  movementType: string = "";
  colourClass: string = "";

  private defaultProblemStates!: string[];

  constructor(
    private deliveryFacade: DeliveryPathFacade,
    private analyticsService: AnalyticsService) { }

  DeliveryStatus = DeliveryStatus;
  CollectionStatus = CollectionStatus;
  GreenStates = GreenStates;
  BlueStates = BlueStates;

  ngOnInit(): void {
    //we're taking advantage of the fact that this component is
    //only rendered if the apiresponse is successful from the deliverypage component.
    //thus we can safely skip any checks for errors
    this.apiResponse$.subscribe(data => {
      if (data.tag === "Success") {
        this.phone = data.value.needhelp.phoneNumber;
        this.iconName = data.value.currentStatus.status;
      }
      this.getAppStatus$.subscribe(data => {
        this.movementType = data;
      })
    })
    this.defaultProblemStates = Object.values(DefaultProblemStates);

    this.showIconName = true;
    if (this.defaultProblemStates.includes(this.iconName)) {
      this.showIconName = false;
      this.colourClass = "red-class";
      if (this.iconName.includes("failed")) {
        if (this.movementType === "Delivery") {
          this.problemMessage = "Delivery failed";
        } else this.problemMessage = "Collection failed";
      }
      else if (this.iconName.includes("cancelled")) {
        this.problemMessage = this.iconName;
      } else {
         this.colourClass = "blue-class";
         this.problemMessage = "Awaiting driver update";
      }
    }
    else if (Object.values(GreenStates).includes(this.iconName as GreenStates)) {
      this.colourClass = "green-class";
    }
    else this.colourClass = "blue-class";
  }

  gaEvent(eventName: string, eventCat: string, eventAction: string, eventLabel: string, eventValue: number) {
    this.analyticsService.sendCustomEvent(eventName, eventCat, eventAction, eventLabel, eventValue);
  }
}
