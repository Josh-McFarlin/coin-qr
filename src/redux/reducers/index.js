import { combineReducers } from 'redux';

import auth from './auth';
import pages from './pages';
import profiles from './profiles';


export default combineReducers({
    auth,
    pages,
    profiles
});
