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

export default function rootReducer(
  state: AdminStore = initialState,
  action: AnyAction
) {
  return {
    clientId: setClientId(state, action),
  };
}
