import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { AdminStore } from "./types";
import rootReducer from "./reducers";

export const initialState: AdminStore = {
  clientId: undefined,
  isClientIdLoading: true,
  isUser: false,
  isAdmin: false,
};

export const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools()
);
