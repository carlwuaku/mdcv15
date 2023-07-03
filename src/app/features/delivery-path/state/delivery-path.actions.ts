import { createAction, props } from '@ngrx/store';
import { HireTrackerResponse } from 'src/app/features/delivery-path/models/hire-tracker-response.model';
import { ProofImage } from 'src/app/features/delivery-path/models/proof-image-model';

export const loadDelivery = createAction(
    '[Delivery-Path/API] Load Delivery'
  );

  export const loadDeliverySuccess = createAction(
    '[Delivery-Path/API] Load Delivery Success',
    props<{ data: HireTrackerResponse }>()
  );

  export const loadDeliveryFailure = createAction(
    '[Delivery-Path/API] Load Delivery Failure',
    props<{ error: Error }>()
  );

  export const loadProofOfDelivery = createAction(
    '[Delivery-Path/API] Load Proof Of Delivery',
    props<{_type:string}>()
  );

  export const loadProofOfDeliverySuccess = createAction(
    '[Delivery-Path/API] Load Proof Of Delivery Success',
    props<{ data: ProofImage[] }>()
  );

  export const loadProofOfDeliveryFailure = createAction(
    '[Delivery-Path/API] Load Proof Of Delivery Failure',
    props<{ error: Error }>()
  );

  export const setAppStatus = createAction('[App] Set App Status', props<{status: string}>())

  export const setUrlParams = createAction('[App] Set Url Params', props<{params: string}>());
  export const setHireOrderId = createAction('[App] Set Hire Order Id', props<{params: string}>())
  export const setMobNumber = createAction('[App] Set Mob Number', props<{params: string}>())