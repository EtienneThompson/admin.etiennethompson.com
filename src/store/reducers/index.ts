import { AdminStore } from "../types";
import { initialState } from "../store";
import { AnyAction } from "redux";

const setClientId = (state: AdminStore, action: AnyAction) => {
  switch (action.type) {
    case "clientId/set":
      return action.payload;
  }

  return state.clientId;
};

const setClientIdLoading = (state: AdminStore, action: AnyAction) => {
  switch (action.type) {
    case "clientId/loading":
      return action.payload;
  }

  return state.isClientIdLoading;
};

const setIsUser = (state: AdminStore, action: AnyAction) => {
  switch (action.type) {
    case "userStatus/setIsUser":
      return action.payload;
  }

  return state.isUser;
};

const setIsAdmin = (state: AdminStore, action: AnyAction) => {
  switch (action.type) {
    case "userStatus/setIsAdmin":
      return action.payload;
  }

  return state.isAdmin;
};

export default function rootReducer(
  state: AdminStore = initialState,
  action: AnyAction
) {
  return {
    clientId: setClientId(state, action),
    isClientIdLoading: setClientIdLoading(state, action),
    isUser: setIsUser(state, action),
    isAdmin: setIsAdmin(state, action),
  };
}
