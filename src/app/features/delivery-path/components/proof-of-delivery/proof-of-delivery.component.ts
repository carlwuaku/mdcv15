import { Component, OnInit, Input } from '@angular/core';
import { ProofImage } from '../../models/proof-image-model';
import { RemoteData } from 'ngx-remotedata';
import { DeliveryPathFacade } from '../../state/delivery-path.facade'
import { Observable } from 'rxjs';
import { AnalyticsService } from 'src/app/core/services/analytics/analytics.service';

@Component({
  selector: 'app-proof-of-delivery',
  templateUrl: './proof-of-delivery.component.html',
  styleUrls: ['./proof-of-delivery.component.scss']
})
export class ProofOfDeliveryComponent implements OnInit {
  @Input() type: string = "";
  @Input() url: string = "";

  responsiveOptions: any[] = [
    {
        breakpoint: '1500px',
        numVisible: 5
    },
    {
        breakpoint: '1024px',
        numVisible: 3
    },
    {
        breakpoint: '768px',
        numVisible: 2
    },
    {
        breakpoint: '560px',
        numVisible: 1
    }
];

  getImages$: Observable<RemoteData<ProofImage[], Error>> = this.deliveryFacade.getProofOfDeliveryApiResponse$;
  //read the current status to determine whether to display 'Proof of Delivery' or 'Proof of Collection'
  getAppStatus$: Observable<string> = this.deliveryFacade.getAppStatus$;
  visible: boolean = false;

  constructor(
    private deliveryFacade: DeliveryPathFacade,
    private analyticsService: AnalyticsService) {
      
    
  }

  ngOnInit(): void {
    if(!this.type){
      this.getAppStatus$.subscribe(data => {
        this.type = data;
      })
    }
    
  }

  /**
   * load the images. depending on whether the type is delivery or collection, call the appropriate store
   */
  loadData() {
    this.deliveryFacade.loadProofOfDeliveryImages(this.type)
    this.visible = true;
  }

  gaEvent() {
    this.analyticsService.sendCustomEvent("{{'Proof of' + this.type}}", "View images", "Proof button", "View images", 1);
  }
}
