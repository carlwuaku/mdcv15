import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import {
  CollectionStatus,
  DeliveryStatus,
  HireTrackerResponse,
  UrlValidationStates,
} from '../../models/hire-tracker-response.model';
import { DeliveryPathFacade } from '../../state/delivery-path.facade';
import { RemoteData } from 'ngx-remotedata';
import { Store } from '@ngrx/store';
import { setAppStatus } from '../../state/delivery-path.actions';
import { UrlValidatorService } from '../../services/url-validator.service';
import { AnalyticsService } from 'src/app/core/services/analytics/analytics.service';

@Component({
  selector: 'delivery-page',
  templateUrl: './delivery-page.component.html',
  styleUrls: ['./delivery-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class DeliveryPageComponent implements OnInit, OnDestroy {
  deliveryStatusValues = Object.values(DeliveryStatus);
  collectionStatusValues = Object.values(CollectionStatus);
  status: string = "";
  getDeliveryPathDataApiResponse$: Observable<RemoteData<HireTrackerResponse, Error>> =
    this.deliveryFacade.getDeliveryPathDataApiResponse$;

  apiResponse$: Observable<RemoteData<HireTrackerResponse, Error>> =
    this.deliveryFacade.getDeliveryPathDataApiResponse$;
  UrlValidationStates = UrlValidationStates;
  private destroy$ = new Subject<void>();
  validationState!: string;
;
  hireOrderId$:Observable<string> =   this.deliveryFacade.getHireOrderId$;
  mobId$:Observable<string> =   this.deliveryFacade.getMobId$;
  getHelpVisible:boolean = false;

  constructor(
    private deliveryFacade: DeliveryPathFacade,
    private store: Store,
    private urlValidator: UrlValidatorService,
    private analyticsService: AnalyticsService) {

  }

  ngOnInit() {
    this.urlValidator.urlValidationState.pipe(takeUntil(this.destroy$)).subscribe(state => {
      //if valid, call load delivery. else, show the error
      this.validationState = state;
      if (state === UrlValidationStates.Valid) {
        this.deliveryFacade.loadDelivery();
      }
    })

    this.getDeliveryPathDataApiResponse$.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data.tag === "Success") {
        let newData = Object.fromEntries(
          Object.entries(CollectionStatus).map(([key, val]) => [key, val.toLowerCase()]),
        );
        let newValue = data.value.currentStatus.status.toLowerCase();

        this.status = "Delivery";
        if (Object.values(newData).includes(newValue as CollectionStatus)) {
          this.status = "Collection";
        }
        this.store.dispatch(setAppStatus({ status: this.status }));
      };
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  showDialog():void{
    this.getHelpVisible = true;
  }

  gaEvent(eventName: string, eventCat: string, eventAction: string, eventLabel: string, eventValue: number) {
    this.analyticsService.sendCustomEvent(eventName, eventCat, eventAction, eventLabel, eventValue);
  }
}
