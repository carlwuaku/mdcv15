import { Action, createReducer, on } from '@ngrx/store';
import {
    failure,
    inProgress,
    notAsked,
    RemoteData,
    success,
} from 'ngx-remotedata';
import { HireTrackerResponse } from 'src/app/features/delivery-path/models/hire-tracker-response.model';
import {
    loadDelivery, loadDeliveryFailure, loadDeliverySuccess, loadProofOfDelivery,
    loadProofOfDeliveryFailure, loadProofOfDeliverySuccess, setAppStatus, setHireOrderId, setMobNumber, setUrlParams
} from './delivery-path.actions';
import { ProofImage } from 'src/app/features/delivery-path/models/proof-image-model';
export const DELIVERY_PATH_FEATURE_KEY = 'deliveryPath';
export interface IDeliveryPathState {
    getDeliveryPathDataApiResponse: RemoteData<HireTrackerResponse, Error>;
    imagesApiResponse: RemoteData<ProofImage[], Error>;
    appStatus: string;
    urlParams: string;
    hireOrderId: string;
    mobId: string;
}

export const initialState: IDeliveryPathState = {
    getDeliveryPathDataApiResponse: notAsked<HireTrackerResponse, Error>(),
    imagesApiResponse: notAsked<ProofImage[], Error>(),
    appStatus: "",
    urlParams: "",
    hireOrderId: "",
    mobId: ""
};

export const DeliveryPathReducer = createReducer(initialState,
    on(loadDelivery, (state, { }) => ({
        ...state,
       getDeliveryPathDataApiResponse: inProgress<HireTrackerResponse, Error>()
    })),
    on(loadDeliverySuccess, (state, { data }) => (
        {
            ...state,
            getDeliveryPathDataApiResponse: success<HireTrackerResponse, Error>(data)
        }
    )),
    on(loadDeliveryFailure, (state, { error }) => (
        {
            ...state,
            getDeliveryPathDataApiResponse: failure<HireTrackerResponse, Error>(error)
        }
    )),

    on(loadProofOfDelivery, (state, { }) => ({
        ...state,
        imagesApiResponse: inProgress<ProofImage[], Error>()
    })),
    on(loadProofOfDeliverySuccess, (state, { data }) => (
        {
            ...state,
            imagesApiResponse: success<ProofImage[], Error>(data)
        }
    )),
    on(loadProofOfDeliveryFailure, (state, { error }) => (
        {
            ...state,
            imagesApiResponse: failure<ProofImage[], Error>(error)
        }
    )),
    on(setAppStatus, (state, { status }) => (
        {
            ...state,
            appStatus: status
        }
    )),
    on(setUrlParams, (state, { params }) => (
        {
            ...state,
            urlParams: params
        }
    )),
    on(setHireOrderId, (state, { params }) => (
        {
            ...state,
            hireOrderId: params
        }
    )),
    on(setMobNumber, (state, { params }) => (
        {
            ...state,
            mobId: params
        }
    ))
)

export function movementReducer(state: IDeliveryPathState | undefined, action: Action) {
    return DeliveryPathReducer(state, action);
}
