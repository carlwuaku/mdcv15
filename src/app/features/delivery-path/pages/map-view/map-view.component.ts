import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DeliveryPathFacade } from '../../state/delivery-path.facade';
import { DeliveryStatus, HireTrackerResponse, UrlValidationStates } from '../../models/hire-tracker-response.model';
import { Observable, Subject, of, takeUntil } from 'rxjs';
import { RemoteData } from 'ngx-remotedata';
import { Store } from '@ngrx/store';
import { loadDelivery } from "../../state/delivery-path.actions";
import { GoogleMap } from '@angular/google-maps';
import { TranslateService } from '@ngx-translate/core';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UrlValidatorService } from '../../services/url-validator.service'

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit, OnDestroy {
  @ViewChild(GoogleMap) map!: GoogleMap;

  markerOptions: google.maps.MarkerOptions = { draggable: false, };
  markers: google.maps.MarkerOptions[] = [];
  mapOptions: google.maps.MapOptions = {
    center: { lat: 54.8008, lng: -4 },
    disableDefaultUI: true,
    zoom: 6,
    mapTypeId: "roadmap"
  };

  defaultCenter: google.maps.LatLngLiteral = { lat: 52, lng: -2 };
  currentLocation: google.maps.MarkerOptions = {
    position: this.mapOptions.center
  }
  stopsLeft: number = 0;
  stopsMessage?: string;

  getApiResponse$: Observable<RemoteData<HireTrackerResponse, Error>> = this.deliveryFacade.getDeliveryPathDataApiResponse$;

  driverName!: string;
  driverPhone!: string;
  showContactDriver: boolean = false;

  defaultTimerInterval: number = 300000;
  refreshInterval: number | undefined = undefined;

  directionsResult$: Observable<google.maps.DirectionsResult | undefined> = of(undefined);
  directionsRendererOptions: google.maps.DirectionsRendererOptions = {
    suppressMarkers: true,
    polylineOptions: { strokeColor: "blue", strokeOpacity: 1.0 }
  }
  private destroy$ = new Subject<void>();

  constructor(
    private deliveryFacade: DeliveryPathFacade,
    private store: Store,
    private translationService: TranslateService,
    private dialog: MatDialog,
    private router: Router,
    private _snackBar: MatSnackBar,
    private urlValidator: UrlValidatorService
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    clearInterval(this.refreshInterval);
  }

  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition((position) => {
      this.defaultCenter = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    });

    //if the url validation does not pass, go back to the home page
    this.urlValidator.urlValidationState.pipe(takeUntil(this.destroy$)).subscribe(state => {
      if (state === UrlValidationStates.Invalid) {
        this.router.navigate(["/"], { queryParamsHandling: "preserve" }).then(() => { }).catch(error => { });
      }
    })

    //call the data if  not asked
    this.deliveryFacade.getDeliveryPathDataApiResponse$.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data.tag === "NotAsked") {
        this.store.dispatch(loadDelivery());
        return;
      }
      if (data.tag === "Success") {
        const locationProp = data.value.currentStatus.location;
        const destinationProp = data.value.orderDetail.deliveryTo.location;
        const destinationIcon = data.value.orderDetail.deliveryToIcon || "./assets/images/location-pin.png";

        const driverPosition = { lng: locationProp.longitude, lat: locationProp.latitude };
        const driverIcon = data.value.depot.icon || "./assets/images/map_icon.svg";
        const destination = { lng: destinationProp.longitude, lat: destinationProp.latitude };

        //check for the current status. if delivered, show driver's location as site location.
        //if collected or not yet dispatched, go back.

        switch (data.value.currentStatus.status) {
          case DeliveryStatus.ON_ITS_WAY:
          case DeliveryStatus.YOU_ARE_OUR_NEXT_DELIVERY:
            break;
          case DeliveryStatus.DELIVERED:
            //set the driver location to the site location
            driverPosition.lat = destination.lat;
            driverPosition.lng = destination.lng;
            break;
          default:
            //go back to home page
            this._snackBar.open(this.translationService.instant("Map not available"), "", {
              duration: 3000
            })
            this.router.navigate(["/"], { queryParamsHandling: "preserve" })
            break;
        }

        this.driverName = data.value.orderDetail.driverName;
        this.driverPhone = data.value.orderDetail.driverPhoneNumber;
        this.showContactDriver = data.value.options.viewContactDriver;

        this.mapOptions = { ...this.mapOptions, center: driverPosition, zoom: 6 };
        this.markers = [
          {
            position: driverPosition,
            draggable: false,
            title: "Driver's Location",
            icon: {
              url: driverIcon,
              scaledSize: new google.maps.Size(50, 50)
            }
          },
          {
            position: destination,
            draggable: false,
            title: "Your Location",
            icon: {
              url: destinationIcon,
              scaledSize: new google.maps.Size(50, 50)
            }
          }
        ];

        this.stopsLeft = (data.value.currentStatus.legNumber - data.value.orderDetail.tourLegNumber);
        if (this.stopsLeft === 0) {
            this.stopsMessage = "You are the next stop";
        }
        //default to every 5 minutes
        const seconds = data.value.options.dataAutoRefreshSeconds || this.defaultTimerInterval

        //start a timer to refresh the data
        if (!this.refreshInterval) {
          this.refreshInterval = window.setInterval(() => {
            this.store.dispatch(loadDelivery());
          }, seconds)
        }
      }
    })
  }

  contactDriver() {
    let message: string = this.translationService.instant(
      `You can call our driver ${this.driverName} on <a href='tel:${this.driverPhone}'>${this.driverPhone}<a/> if it is urgent.
       Please be mindful that the driver may only answer if it is safe to do so`
    );
    let title: string = this.translationService.instant(`Contact the driver`);

    this.dialog.open(DialogComponent, {
      data: {
        title: title,
        message: message,
        icon: "",
        closeOnTimer: false
      }
    });
  }
}
