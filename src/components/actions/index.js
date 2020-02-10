import { MYUSER } from './types';

export const reduxUser = (myuser) => async dispatch => {

    dispatch({ type: MYUSER, payload: myuser })
}