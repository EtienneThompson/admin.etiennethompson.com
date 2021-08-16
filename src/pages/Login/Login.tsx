import React from "react";
import queryString from "query-string";
import { useDispatch } from "react-redux";
import { updateClientId } from "../../store/actions";
import { Toolbar } from "../../components/common/Toolbar";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { LoginProps } from "./Login.types";
import { writeToLocalStorage } from "../../utils/localStorage";
import { LocalStorageKey } from "../../types";
import "./Login.scss";

export const Login: React.FunctionComponent<LoginProps> = (
  props: LoginProps
) => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    // Extract clientId from the url.
    let params = queryString.parse(window.location.search.substring(1));
    let clientId = params.clientId
      ? Array.isArray(params.clientId)
        ? params.clientId[0]
        : params.clientId
      : "";
    // Write the clientId to local storage for restoration on refresh.
    writeToLocalStorage(LocalStorageKey.ClientId, clientId);
    // Set clientId in the state.
    dispatch(updateClientId(clientId));
    // Push to the dashboard.
    props.history.push("/dashboard");
  }, [dispatch, props.history]);

  return (
    <div>
      <Toolbar />
      <LoadingSpinner />
    </div>
  );
};
