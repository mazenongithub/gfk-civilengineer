import { SLOPESTABILITY } from '../actions/types';

export default function (state = {}, action) {
    switch (action.type) {
        case SLOPESTABILITY:
            return action.payload;
        default:
            return state;
    }
}