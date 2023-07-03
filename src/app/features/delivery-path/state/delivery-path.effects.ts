import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { MessageService } from "primeng/api";
import { DeliveryPathHttpService } from "../services/delivery-path-http.service";
import { loadDelivery, loadDeliveryFailure, loadDeliverySuccess, loadProofOfDelivery, loadProofOfDeliveryFailure, loadProofOfDeliverySuccess } from "./delivery-path.actions";
import { HireTrackerResponse } from "src/app/features/delivery-path/models/hire-tracker-response.model";
import { map, tap, switchMap, catchError, of, withLatestFrom } from "rxjs";
import { ProofImageResponse } from "src/app/features/delivery-path/models/proof-image-model";
import { Store } from "@ngrx/store";
import { getAppStatus, getUrlParams } from "./delivery-path.selectors";

@Injectable()
export class DeliveryPathEffects {
    constructor(
        private readonly actions$: Actions,
        private readonly deliveryPathHttpService: DeliveryPathHttpService,
        private readonly messageService: MessageService,
        private store: Store
    ) { }

    loadDelivery$ = createEffect(() => this.actions$.pipe(
        ofType(loadDelivery),
        withLatestFrom(
            this.store.select(getUrlParams)
        ),
        switchMap(([action, params]) => {
            return this.deliveryPathHttpService.getCollectionData(params)
                .pipe(
                    map((res: HireTrackerResponse) => {
                        return loadDeliverySuccess({ data: res })
                    }),
                    catchError((error: Error) => {
                        return of(loadDeliveryFailure({ error }))
                    })
                )
        })
    ));


    loadDeliverySuccess$ = createEffect(() => this.actions$.pipe(
        ofType(loadDeliverySuccess),
        tap(
            () => this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Load Delivery Success'
            })
        )
    ),
        {
            dispatch: false
        });

    loadDeliveryFailure$ = createEffect(() => this.actions$.pipe(
        ofType(loadDeliveryFailure),
        tap(
            () => this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Load Delivery Success'
            })
        )
    ),
        {
            dispatch: false
        });


    /**
     * get the proof of delivery images. when loaded successfully, the loadProofOfDeliverySuccess action will be dispatched
     * and the reducer will use the data to update the state. similar thing happens when there's an error
     */
    loadProofOfDelivery$ = createEffect(() => this.actions$.pipe(
        ofType(loadProofOfDelivery),
        withLatestFrom(
            this.store.select(getUrlParams)
        ),
        switchMap(([action, params]) => {
            return this.deliveryPathHttpService.getProofImages(params, action._type)
                .pipe(
                    map((res: ProofImageResponse) => {
                        return loadProofOfDeliverySuccess({ data: res.images })
                    }),
                    catchError((error: Error) => {
                        return of(loadProofOfDeliveryFailure({ error }))
                    })
                )
        })
    ));

}