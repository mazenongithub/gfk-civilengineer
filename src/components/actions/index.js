import { MYUSER, ZONECHARTS, PTSLAB, SEISMIC, SLOPESTABILITY, PROJECTS, COMPANY } from './types';

export const reduxUser = (myuser) => async dispatch => {

    dispatch({ type: MYUSER, payload: myuser })
}

export const reduxProjects = (projects) => async dispatch => {

    dispatch({ type: PROJECTS, payload: projects})
}

export const reduxCompany = (company) => async dispatch => {

    dispatch({ type: COMPANY, payload: company })
}

export const reduxPTSlab = (ptslab) => async dispatch => {

    dispatch({ type: PTSLAB, payload: ptslab })
}

export const reduxSeismic = (seismic) => async dispatch => {

    dispatch({ type: SEISMIC, payload: seismic })
}

export const reduxSlopeStability = (slopestability) => async dispatch => {
    

    dispatch({ type: SLOPESTABILITY, payload: slopestability })
}

