import { SEISMIC } from '../actions/types';

export default function (state = {}, action) {
    switch (action.type) {
        case SEISMIC:
            return action.payload;
        default:
            return state;
    }
}