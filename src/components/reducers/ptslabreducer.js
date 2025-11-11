import { PTSLAB } from '../actions/types';

export default function PTslabReducer (state = {}, action) {
    switch (action.type) {
        case PTSLAB:
            return action.payload;
        default:
            return state;
    }
}