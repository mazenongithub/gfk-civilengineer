import { MYUSER } from '../actions/types';

export default function (state = {}, action) {
    switch (action.type) {
        case MYUSER:
            return action.payload;
        default:
            return state;
    }
}