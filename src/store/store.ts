import { createStore, compose } from "redux";
import { AdminStore } from "./types";
import rootReducer from "./reducers";

export const initialState: AdminStore = {
  clientId: undefined,
};

const composedEnhancers = compose();

export const store = createStore(rootReducer, initialState, composedEnhancers);
