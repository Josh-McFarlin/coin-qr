import {
    CREATE_PAGE_SUCCESSFUL,
    FETCH_PAGE_SUCCESSFUL,
    FETCH_RECENT_SUCCESSFUL,
    UPDATE_PAGE_SUCCESSFUL
} from '../../actions/pages/types';


const initialState = {
    page: null,
    recentPages: null
};

const reducer = (state, action) => {
    switch (action.type) {
        case CREATE_PAGE_SUCCESSFUL:
            return {
                ...state,
                ...action.payload
            };
        case UPDATE_PAGE_SUCCESSFUL:
            return {
                ...state,
                ...action.payload
            };
        case FETCH_PAGE_SUCCESSFUL:
            return {
                ...state,
                ...action.payload
            };
        case FETCH_RECENT_SUCCESSFUL:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state || initialState;
    }
};

export default reducer;
