import { combineReducers } from 'redux';
import myuser from './myuserreducer';
import zonecharts from './ptslabzonereducer'
import ptslab from './ptslabreducer';
import seismic from './seismicreducer';
import slopestability from './slopestabilityreducer'

export default combineReducers({
    myuser,
    zonecharts,
    ptslab,
    seismic,
    slopestability
})