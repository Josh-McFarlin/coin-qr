import { AUTH_SUCCESSFUL, AUTH_FAILURE } from '../../actions/auth/types';


const initialState = {
    user: null,
    authFailure: null
};

const reducer = (state, action) => {
    switch (action.type) {
        case AUTH_SUCCESSFUL:
            return {
                ...state,
                ...action.payload,
                authFailure: null
            };
        case AUTH_FAILURE:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state || initialState;
    }
};

export default reducer;
