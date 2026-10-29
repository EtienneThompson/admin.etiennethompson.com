import React from "react";
import queryString from "query-string";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/common/Button";
import { AlertIcon, LogInIcon } from "../../components/common/Icons";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { SplashCard } from "../../components/common/SplashCard";
import { login } from "../../store/actions";
import { redirectToLogin } from "../../utils/session";
import { useDocumentTitle } from "../../utils/useDocumentTitle";
import { extractQueryParam } from "./Login.utils";
import "./Login.scss";

// Where login.etiennethompson.com sends users after they sign in.
export const Login = () => {
  useDocumentTitle("Signing in");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [hasFailed, setHasFailed] = React.useState(false);

  React.useEffect(() => {
    // Extract the session from the url.
    let params = queryString.parse(window.location.search);
    let clientId = extractQueryParam(params, "clientId");
    let isUser = extractQueryParam(params, "isUser");
    let isAdmin = extractQueryParam(params, "isAdmin");
    if (clientId && isUser && isAdmin) {
      dispatch(login(clientId, isUser, isAdmin));
      navigate("/dashboard", { replace: true });
    } else {
      setHasFailed(true);
    }
  }, [dispatch, navigate]);

  if (hasFailed) {
    return (
      <SplashCard
        icon={<AlertIcon />}
        iconVariant="danger"
        title="We couldn't sign you in"
        description="The sign in link is missing some details. Try signing in again."
      >
        <Button fullWidth icon={<LogInIcon />} onClick={redirectToLogin}>
          Sign in again
        </Button>
      </SplashCard>
    );
  }

  return (
    <SplashCard
      icon={<LoadingSpinner />}
      title="Signing you in…"
      description="Hang tight, you'll be sent to the dashboard in a moment."
    />
  );
};
