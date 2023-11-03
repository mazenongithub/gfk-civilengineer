import { ZONECHARTS } from '../actions/types';

export default function (state = {}, action) {
    switch (action.type) {
        case ZONECHARTS:
            return action.payload;
        default:
            return state;
    }
}