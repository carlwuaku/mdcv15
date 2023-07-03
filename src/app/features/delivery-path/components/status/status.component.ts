import { Component, OnInit } from '@angular/core';
import { CollectionStatus, DefaultMapStates, DefaultNoETAStates, DefaultProofStates, DefaultTrueStates, DeliveryStatus, HireTrackerResponse } from '../../models/hire-tracker-response.model';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../../shared/components/dialog/dialog.component';
import { DeliveryPathFacade } from '../../state/delivery-path.facade';
import { Observable } from 'rxjs';
import { RemoteData } from 'ngx-remotedata';
import { AnalyticsService } from 'src/app/core/services/analytics/analytics.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {
  errorMessage: string = "";
  //show different controls based on the status
  showArriving: boolean = false;
  showDeliveryType: boolean = false;
  showETA: boolean = false;
  showETC: boolean = false;
  showShareButton: boolean = false;
  showViewMapButton: boolean = false;
  showPoDButton: boolean = false;
  showDeliveredAt: boolean = false;
  showCollectedAt: boolean = false;
  showContactUsButton: boolean = false;
  DeliveryStatus = DeliveryStatus;
  showCollectionScheduled: boolean = false;
  showSchedulingCollection: boolean = false;

  hireDetails!: HireTrackerResponse;
  movementType: string = "";

  private defaultTrueStates!: string[];
  private defaultNoETAStates!: string[];
  private defaultMapStates!: string[];
  private defaultProofStates!: string[];

  constructor(
    private translationService: TranslateService,
    private dialog: MatDialog,
    private deliveryFacade: DeliveryPathFacade,
    private analyticsService: AnalyticsService) {
  }

  public notify(event: string, button: string): void {
    let title: string = "";
    let message: string = "";
    if (button === "share") {
      title = this.translationService.instant(`URL copied`);
      message = this.translationService.instant(`'${event}' has been copied to the clipboard`);
    } else {
      message = this.translationService.instant(
        `Unfornately we cannot complete your order due to a problem we encountered. Please contact us for further information. [insert contact details]`
      );
      title = this.translationService.instant(`Contact support`);
    };

    const dlg = this.dialog.open(DialogComponent, {
      data: {
        title: title,
        message: message,
        icon: "",
        closeOnTimer: false
      }
    });

    dlg.afterClosed().subscribe((result: boolean) => {
      if (result && result != undefined) {
        console.log(result);
      }
    });
  }

  apiResponse$: Observable<RemoteData<HireTrackerResponse, Error>> =
    this.deliveryFacade.getDeliveryPathDataApiResponse$;
  getAppStatus$: Observable<string> = this.deliveryFacade.getAppStatus$;

  ngOnInit(): void {
    this.apiResponse$.subscribe(data => {
      if (data.tag === "Success") {
        this.hireDetails = data.value;
      }
      this.getAppStatus$.subscribe(data => {
        this.movementType = data;
      })
    })

    this.defaultTrueStates = Object.values(DefaultTrueStates);
    this.defaultNoETAStates = Object.values(DefaultNoETAStates);
    this.defaultMapStates = Object.values(DefaultMapStates);
    this.defaultProofStates = Object.values(DefaultProofStates);

    if (this.defaultTrueStates.includes(this.hireDetails.currentStatus.status)) {
      this.showArriving = true;
      this.showDeliveryType = true;
      this.showETA = true;
      this.showETC = false;
    } else {
      this.showArriving = false;
      this.showDeliveryType = false;
      this.showETA = false;
      this.showETC = false;
    }

    if (this.defaultNoETAStates.includes(this.hireDetails.currentStatus.status)) {
      this.showETA = false;
    }

    if (this.defaultMapStates.includes(this.hireDetails.currentStatus.status)) {
      this.showViewMapButton = true;
    } else this.showViewMapButton = false;

    if (this.defaultProofStates.includes(this.hireDetails.currentStatus.status)) {
      this.showPoDButton = true;
    } else this.showPoDButton = false;

    this.showDeliveredAt = false;
    this.showCollectedAt = false;

    //the application status (collection or delivery) would be set to collection if the status is one of the collection ones.
    //else the default Delivery remains
    switch (this.hireDetails.currentStatus.status) {
      case DeliveryStatus.DELIVERED:
        this.showDeliveredAt = true;
        break;
      case CollectionStatus.COLLECTION_SCHEDULED:
        this.showCollectionScheduled = true;
        break;
      case CollectionStatus.SCHEDULING_COLLECTION:
        this.showSchedulingCollection = true;
        break;
      case CollectionStatus.COLLECTED:
        this.showCollectedAt = true;
        break;
      default:
        break;
    }
    /* the settings from the backend should override the status config in the UI */
    if (!this.hireDetails.options.viewOnMap) {
      this.showViewMapButton = false;
    }

    if (this.showViewMapButton) {
      /* check that we have 2 valid location co-ordinates */
      const isEmptyDriver = Object.values(this.hireDetails.currentStatus.location).every(x => x === 0 || x === null);
      const isEmptyDest = Object.values(this.hireDetails.orderDetail.deliveryTo.location).every(x => x === 0 || x === null);
      if (isEmptyDriver || isEmptyDest) {
        this.showViewMapButton = false;
      }
    }

    this.showShareButton = true;
    this.showContactUsButton = this.hireDetails.options.viewContactSupport;
  }

  clipURL() {
    return window.location.href;
  }

  contactDialog() {
    this.notify('contact', 'contact');
  }

  gaEvent(eventName: string, eventCat: string, eventAction: string, eventLabel: string, eventValue: number) {
    this.analyticsService.sendCustomEvent(eventName, eventCat, eventAction, eventLabel, eventValue);
  }
}
