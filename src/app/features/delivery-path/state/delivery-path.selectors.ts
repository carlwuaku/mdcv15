import { createFeatureSelector, createSelector, State } from '@ngrx/store';
import { DELIVERY_PATH_FEATURE_KEY, IDeliveryPathState } from './delivery-path.reducer';

export const selectDeliveryPathState = createFeatureSelector<IDeliveryPathState>(DELIVERY_PATH_FEATURE_KEY);
export const getDeliveryPathDataApiResponse = createSelector(
    selectDeliveryPathState, (state: IDeliveryPathState) => state.getDeliveryPathDataApiResponse
);

//proof of delivery images selector
export const getProofOfDeliveryImages = createSelector(selectDeliveryPathState, (state: IDeliveryPathState) => state.imagesApiResponse);
//get the current app status: whether Collection or Delivery
export const getAppStatus = createSelector(selectDeliveryPathState, (state: IDeliveryPathState) => state.appStatus)

//get the url id and signature
export const getUrlParams = createSelector(selectDeliveryPathState, (state: IDeliveryPathState) => state.urlParams);

//get the hireorderid and mob id
export const getHireOrderId = createSelector(selectDeliveryPathState, (state: IDeliveryPathState) => state.hireOrderId);
export const getMobId = createSelector(selectDeliveryPathState, (state: IDeliveryPathState) => state.mobId);