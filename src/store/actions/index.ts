import { AnyAction } from "redux";
import {
  writeToLocalStorage,
  deleteFromLocalStorage,
} from "../../utils/localStorage";
import { LocalStorageKey } from "../../types";

export const setIsLoading = (status: boolean): AnyAction => {
  return {
    type: "loading/set",
    payload: status,
  };
};

export const updateClientId = (newClientId: string | undefined): AnyAction => {
  return {
    type: "clientId/set",
    payload: newClientId,
  };
};

export const loadingClientId = (loading: boolean): AnyAction => {
  return {
    type: "clientId/loading",
    payload: loading,
  };
};

export const updateIsUser = (isUser: boolean): AnyAction => {
  return {
    type: "userStatus/setIsUser",
    payload: isUser,
  };
};

export const updateIsAdmin = (isAdmin: boolean): AnyAction => {
  return {
    type: "userStatus/setIsAdmin",
    payload: isAdmin,
  };
};

export const setLoginStatus = (loginStatus: boolean): AnyAction => {
  return {
    type: "login/set",
    payload: loginStatus,
  };
};

export const login = (
  clientId: string,
  isUser: boolean,
  isAdmin: boolean
): AnyAction => {
  writeToLocalStorage(LocalStorageKey.ClientId, clientId);
  updateClientId(clientId);

  writeToLocalStorage(LocalStorageKey.IsUser, isUser);
  updateIsUser(isUser);

  writeToLocalStorage(LocalStorageKey.IsAdmin, isAdmin);
  updateIsAdmin(isAdmin);

  return {
    type: "login/set",
    payload: true,
  };
};

export const logout = (): AnyAction => {
  deleteFromLocalStorage(LocalStorageKey.ClientId);
  updateClientId(undefined);

  deleteFromLocalStorage(LocalStorageKey.IsUser);
  updateIsUser(false);

  deleteFromLocalStorage(LocalStorageKey.IsAdmin);
  updateIsAdmin(false);

  return {
    type: "login/set",
    payload: false,
  };
};
