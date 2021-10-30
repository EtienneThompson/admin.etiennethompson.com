import React from "react";
import queryString from "query-string";
import { useDispatch } from "react-redux";
import {
  updateClientId,
  updateIsAdmin,
  updateIsUser,
} from "../../store/actions";
import { Toolbar } from "../../components/common/Toolbar";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { LoginProps } from "./Login.types";
import { writeToLocalStorage } from "../../utils/localStorage";
import { LocalStorageKey } from "../../types";
import { extractQueryParam } from "./Login.utils";
import "./Login.scss";

export const Login: React.FunctionComponent<LoginProps> = (
  props: LoginProps
) => {
  document.title = "Etienne Thompson Admin Center - Login";
  document.documentElement.className = "theme-light";
  const dispatch = useDispatch();

  React.useEffect(() => {
    // Extract clientId from the url.
    let params = queryString.parse(window.location.search);
    let clientId = extractQueryParam(params, "clientId");
    let isUser = extractQueryParam(params, "isUser");
    let isAdmin = extractQueryParam(params, "isAdmin");
    if (clientId && isUser && isAdmin) {
      // Write the clientId to local storage for restoration on refresh.
      writeToLocalStorage(LocalStorageKey.ClientId, clientId);
      writeToLocalStorage(LocalStorageKey.IsUser, isUser);
      writeToLocalStorage(LocalStorageKey.IsAdmin, isAdmin);
      // Set the state based on return values.
      dispatch(updateClientId(clientId));
      dispatch(updateIsUser(isUser));
      dispatch(updateIsAdmin(isAdmin));
      // Push to the dashboard.
      props.history.push("/dashboard");
    }
  }, [dispatch, props.history]);

  return (
    <div>
      <Toolbar />
      <LoadingSpinner />
    </div>
  );
};
