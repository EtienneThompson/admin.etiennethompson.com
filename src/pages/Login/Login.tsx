import React from "react";
import queryString from "query-string";
import { useDispatch, useSelector } from "react-redux";
import { AdminStore } from "../../store/types";
import { login, setIsLoading } from "../../store/actions";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { Container } from "../../components/common/Grid";
import { LoginProps } from "./Login.types";
import { extractQueryParam } from "./Login.utils";
import { LogoutReasons } from ".";
import "./Login.scss";

export const Login: React.FunctionComponent<LoginProps> = (
  props: LoginProps
) => {
  document.title = "Etienne Thompson Admin Center - Login";
  document.documentElement.className = "theme-light";
  const dispatch = useDispatch();

  const [reason, setReason] = React.useState(0);

  const isLoading = useSelector((state: AdminStore) => state.isLoading);

  React.useEffect(() => {
    // Extract clientId from the url.
    dispatch(setIsLoading(true));
    let params = queryString.parse(window.location.search);
    let clientId = extractQueryParam(params, "clientId");
    let isUser = extractQueryParam(params, "isUser");
    let isAdmin = extractQueryParam(params, "isAdmin");
    if (clientId && isUser && isAdmin) {
      dispatch(login(clientId, isUser, isAdmin));
      // Push to the dashboard.
      props.history.push("/dashboard");
    }
    setReason(extractQueryParam(params, "reason"));
    dispatch(setIsLoading(false));
  }, [dispatch, props.history]);

  const logoutReasons: LogoutReasons = {
    0: "You have successfully been loged out.",
    1: "Your session has expired. Please login again to continue.",
  };

  return (
    <Container>
      {isLoading && <LoadingSpinner />}
      {!isLoading && (
        <div style={{ width: "50%", textAlign: "center" }}>
          {logoutReasons[reason]}
        </div>
      )}
    </Container>
  );
};
