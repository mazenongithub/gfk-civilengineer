import { PROJECTS } from '../actions/types';

export default function myProjectsReducer(state = {}, action) {
    switch (action.type) {
        case PROJECTS:
            return action.payload;
        default:
            return state;
    }
}