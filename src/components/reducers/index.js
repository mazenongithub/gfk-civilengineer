import { combineReducers } from 'redux';
import myuser from './myuserreducer';
import zonecharts from './ptslabzonereducer'
import ptslab from './ptslabreducer';

export default combineReducers({
    myuser,
    zonecharts,
    ptslab
})