import React from "react";
import queryString from "query-string";
import { Container } from "../../components/common/Grid";
import { extractQueryParam } from "../Login/Login.utils";
import { LogoutReasons } from "./Logout.types";
import "./Logout.scss";

export const Logout = () => {
  document.title = "Etienne Thompson Admin Center - Logout";
  document.documentElement.className = "theme-light";

  const [reason, setReason] = React.useState(0);

  React.useEffect(() => {
    let params = queryString.parse(window.location.search);
    setReason(extractQueryParam(params, "reason"));
  }, []);

  const logoutReasons: LogoutReasons = {
    0: "You have successfully been logged out.",
    1: "Your session has expired. Please login again to continue.",
  };

  return (
    <Container>
      <div style={{ width: "50%", textAlign: "center" }}>
        {logoutReasons[reason]}
      </div>
    </Container>
  );
};
