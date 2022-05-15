import { AdminStore } from "../types";
import { initialState } from "../store";
import { AnyAction } from "redux";

const setIsLoading = (state: AdminStore, action: AnyAction) => {
  switch (action.type) {
    case "loading/set":
      return action.payload;
  }

  return state.isLoading;
};

const setIsButtonPressed = (state: AdminStore, action: AnyAction) => {
  switch (action.type) {
    case "loading/button":
      return action.payload;
  }

  return state.isButtonPressed;
};

const setShowMenu = (state: AdminStore, action: AnyAction) => {
  switch (action.type) {
    case "menu/show":
      return action.payload;
  }

  return state.showMenu;
};

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

const setIsLoggedIn = (state: AdminStore, action: AnyAction) => {
  switch (action.type) {
    case "login/set":
      return action.payload;
  }

  return state.isLoggedIn;
};

export default function rootReducer(
  state: AdminStore = initialState,
  action: AnyAction
) {
  return {
    isLoading: setIsLoading(state, action),
    isButtonPressed: setIsButtonPressed(state, action),
    showMenu: setShowMenu(state, action),
    clientId: setClientId(state, action),
    isClientIdLoading: setClientIdLoading(state, action),
    isUser: setIsUser(state, action),
    isAdmin: setIsAdmin(state, action),
    isLoggedIn: setIsLoggedIn(state, action),
  };
}
