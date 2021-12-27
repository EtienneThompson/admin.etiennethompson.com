import React from "react";
import queryString from "query-string";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, setIsLoading } from "../../store/actions";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { Container } from "../../components/common/Grid";
import { LoginProps } from "./Login.types";
import { extractQueryParam } from "./Login.utils";
import "./Login.scss";

export const Login: React.FunctionComponent<LoginProps> = (
  props: LoginProps
) => {
  document.title = "Etienne Thompson Admin Center - Login";
  document.documentElement.className = "theme-light";
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      navigate("/dashboard");
    }
    dispatch(setIsLoading(false));
  }, [dispatch, navigate]);
  return (
    <Container>
      <LoadingSpinner />
    </Container>
  );
};
