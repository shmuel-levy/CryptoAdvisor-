import { legacy_createStore as createStore, combineReducers } from 'redux'

import { userReducer } from './user.reducer'

const rootReducer = combineReducers({
    userModule: userReducer
})

const devtools =
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()

export const store = createStore(rootReducer, devtools)
