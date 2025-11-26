import { combineReducers } from 'redux';
import myuser from './myuserreducer';
import company from './companyreducer'
import ptslab from './ptslabreducer';
import seismic from './seismicreducer';
import slopestability from './slopestabilityreducer'
import projects from './projectsreducer'

export default combineReducers({
    myuser,
    company,
    ptslab,
    seismic,
    slopestability,
    projects
})