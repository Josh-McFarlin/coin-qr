import {
    CREATE_PROFILE_SUCCESSFUL,
    FETCH_PROFILE_SUCCESSFUL,
    UPDATE_PROFILE_SUCCESSFUL
} from '../../actions/profiles/types';


const initialState = {
    profile: null
};

const reducer = (state, action) => {
    switch (action.type) {
        case CREATE_PROFILE_SUCCESSFUL:
            return {
                ...state,
                ...action.payload
            };
        case UPDATE_PROFILE_SUCCESSFUL:
            return {
                ...state,
                ...action.payload
            };
        case FETCH_PROFILE_SUCCESSFUL:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state || initialState;
    }
};

export default reducer;
