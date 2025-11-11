import { SEISMIC } from '../actions/types';

export default function seismicReducer (state = {}, action) {
    switch (action.type) {
        case SEISMIC:
            return action.payload;
        default:
            return state;
    }
}