import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
//Reducer
import authReducer from "../reducers/authReducer";
import alertReducer from "../reducers/alertReducer";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  combineReducers({
    auth: authReducer,
    alert: alertReducer
  }),
  composeEnhancers(applyMiddleware(thunk))
);
export default store;
