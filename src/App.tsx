import React from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { Toolbar } from "./components/common/Toolbar";
import { Container } from "./components/common/Grid";
import { LandingPage } from "./pages/LandingPage";
import { Login } from "./pages/Login";
import { Logout } from "./pages/Logout";
import { Dashboard } from "./pages/Dashboard";
import { ApplicationControl } from "./pages/ApplicationControl";

import { readFromLocalStorage } from "./utils/localStorage";
import { LocalStorageKey } from "./types";
import { login, setLoginStatus } from "./store/actions";
import "./App.scss";

export const App = () => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    const clientId = readFromLocalStorage(LocalStorageKey.ClientId);
    const isUser = readFromLocalStorage(LocalStorageKey.IsUser) === "true";
    const isAdmin = readFromLocalStorage(LocalStorageKey.IsAdmin) === "true";
    if (clientId && isUser && isAdmin) {
      dispatch(login(clientId, isUser, isAdmin));
    } else {
      dispatch(setLoginStatus(false));
      // window.location.href = "/login?reason=0";
    }
  }, [dispatch]);

  return (
    <div className="App">
      <Container>
        <Toolbar />
        <Route exact path="/" component={LandingPage} />
        <Route path="/login" component={Login} />
        <Route path="/logout" component={Logout} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/application" component={ApplicationControl} />
      </Container>
    </div>
  );
};
