import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { SharedModule } from '../../shared/shared.module';

import { DeliveryPathRoutingModule } from './delivery-path-routing.module';
import { DeliveryPageComponent } from './pages/delivery-page/delivery-page.component';
import { DeliveryPathReducer, DELIVERY_PATH_FEATURE_KEY } from './state/delivery-path.reducer';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { DeliveryPathEffects } from './state/delivery-path.effects';
import { RemoteDataModule } from 'ngx-remotedata';
import { DeliveryPathFacade } from './state/delivery-path.facade';
import { MessageService } from 'primeng/api';

import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { TrackingHistoryComponent } from './components/tracking-history/tracking-history.component';
import { NeedHelpComponent } from './components/need-help/need-help.component';
import { StatusIconComponent } from './components/status-icon/status-icon.component';
import { LayoutComponent } from './components/layout/layout.component';
import { StatusComponent } from './components/status/status.component';
import { ContactSupportComponent } from './components/contact-support/contact-support.component';
import { ProofOfDeliveryComponent } from './components/proof-of-delivery/proof-of-delivery.component';
import { DeliveryPathHttpService } from './services/delivery-path-http.service';
import { MapViewComponent } from './pages/map-view/map-view.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { TimelineComponent } from './components/timeline/timeline.component';
@NgModule({
  declarations: [
    DeliveryPageComponent,
    OrderDetailsComponent,
    TrackingHistoryComponent,
    NeedHelpComponent,
    StatusIconComponent,
    LayoutComponent,
    StatusComponent,

    ContactSupportComponent,
    ProofOfDeliveryComponent,
    MapViewComponent,
    TimelineComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    DeliveryPathRoutingModule,
    StoreModule.forFeature(DELIVERY_PATH_FEATURE_KEY, DeliveryPathReducer),
    EffectsModule.forFeature([DeliveryPathEffects]),
    HttpClientModule,
    RemoteDataModule,
    GoogleMapsModule
  ],
  providers: [DeliveryPathFacade, MessageService, DeliveryPathHttpService],
  exports:[
    OrderDetailsComponent,
    TrackingHistoryComponent,
    NeedHelpComponent,
    StatusIconComponent,
    LayoutComponent,
    ContactSupportComponent,
    ProofOfDeliveryComponent,
    TimelineComponent
  ]

})
export class DeliveryPathModule { }
