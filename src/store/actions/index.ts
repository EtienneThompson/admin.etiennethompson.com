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
