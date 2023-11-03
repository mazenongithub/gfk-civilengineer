import { MYUSER, ZONECHARTS, PTSLAB } from './types';

export const reduxUser = (myuser) => async dispatch => {

    dispatch({ type: MYUSER, payload: myuser })
}

export const reduxZones = (zonecharts) => async dispatch => {

    dispatch({ type: ZONECHARTS, payload: zonecharts })
}

export const reduxPTSlab = (ptslab) => async dispatch => {

    dispatch({ type: PTSLAB, payload: ptslab })
}
