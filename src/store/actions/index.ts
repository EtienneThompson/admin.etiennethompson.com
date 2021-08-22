import { AnyAction } from "redux";

export const updateClientId = (newClientId: string): AnyAction => {
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
