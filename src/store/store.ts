import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { AdminStore } from "./types";
import rootReducer from "./reducers";
import { readStoredSession } from "../utils/session";

// Restore a saved session up front, so pages can make API calls on their
// first render.
const storedSession = readStoredSession();

export const initialState: AdminStore = {
  isLoading: false,
  isButtonPressed: false,
  showMenu: false,
  clientId: storedSession?.clientId,
  isClientIdLoading: true,
  isUser: storedSession?.isUser ?? false,
  isAdmin: storedSession?.isAdmin ?? false,
  isLoggedIn: storedSession !== undefined,
};

export const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools()
);
