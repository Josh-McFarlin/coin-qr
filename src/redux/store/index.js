/* eslint-disable no-underscore-dangle */
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from '../reducers';


// eslint-disable-next-line no-underscore-dangle,no-mixed-operators
const composeEnhancers = typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middleware = [thunk];

const makeConfiguredStore = (reducer, initialState) =>
    createStore(reducer, initialState, composeEnhancers(applyMiddleware(...middleware)));

export const makeStore = (initialState, { isServer, req, debug, storeKey }) => {
    if (isServer) {
        return makeConfiguredStore(rootReducer, initialState);
    }

    const { persistStore, persistReducer } = require('redux-persist');
    const storage = require('redux-persist/lib/storage').default;

    const persistConfig = {
        key: 'nextjs',
        whitelist: ['auth'],
        storage
    };

    const persistedReducer = persistReducer(persistConfig, rootReducer);
    const store = makeConfiguredStore(persistedReducer, initialState);

    store.__persistor = persistStore(store); // Nasty hack

    return store;
};

export default makeStore;
