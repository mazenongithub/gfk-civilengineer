import { MYUSER } from '../actions/types';

export default function myUserReducer (state = {}, action) {
    switch (action.type) {
        case MYUSER:
            return action.payload;
        default:
            return state;
    }
}