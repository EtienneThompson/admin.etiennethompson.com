import { AnyAction } from "redux";

export const updateClientId = (newClientId: string): AnyAction => {
  return {
    type: "clientId/set",
    payload: newClientId,
  };
};
