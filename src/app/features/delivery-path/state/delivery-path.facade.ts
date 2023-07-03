import { Injectable } from "@angular/core";
import { select, Store } from '@ngrx/store';
import { getAppStatus, getDeliveryPathDataApiResponse, getHireOrderId, getMobId, getProofOfDeliveryImages, getUrlParams } from "./delivery-path.selectors";
import { loadDelivery, loadProofOfDelivery } from "./delivery-path.actions";

@Injectable()
export class DeliveryPathFacade{
    getDeliveryPathDataApiResponse$ = this.store.pipe(
        select(getDeliveryPathDataApiResponse)
    )

    getProofOfDeliveryApiResponse$ = this.store.pipe(
        select(getProofOfDeliveryImages)
    )

    getAppStatus$ = this.store.pipe(select(getAppStatus))

    getUrlParams$ = this.store.pipe(select(getUrlParams));
    getHireOrderId$ = this.store.pipe(select(getHireOrderId));
    getMobId$ = this.store.pipe(select(getMobId))
;

    constructor(private readonly store:Store){}

    loadDelivery():void{
        this.store.dispatch(loadDelivery())
    }

    /**
     * get the list of proof of delivery images for an order
     */
    loadProofOfDeliveryImages(type: string):void{
        this.store.dispatch(loadProofOfDelivery({_type: type}))
    }
}