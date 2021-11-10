import React from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { Toolbar } from "./components/common/Toolbar";
import { Container } from "./components/common/Grid";
import { LandingPage } from "./pages/LandingPage";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { ApplicationControl } from "./pages/ApplicationControl";

import { readFromLocalStorage } from "./utils/localStorage";
import { LocalStorageKey } from "./types";
import {
  loadingClientId,
  updateClientId,
  updateIsUser,
  updateIsAdmin,
} from "./store/actions";
import "./App.scss";

export const App = () => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(loadingClientId(true));
    const clientId = readFromLocalStorage(LocalStorageKey.ClientId);
    if (clientId) {
      dispatch(updateClientId(clientId));
    }
    const isUser = readFromLocalStorage(LocalStorageKey.IsUser);
    if (isUser) {
      dispatch(updateIsUser(isUser === "true"));
    }
    const isAdmin = readFromLocalStorage(LocalStorageKey.IsAdmin);
    if (isAdmin) {
      dispatch(updateIsAdmin(isAdmin === "true"));
    }
    dispatch(loadingClientId(false));
  }, [dispatch]);

  return (
    <div className="App">
      <Container>
        <Toolbar />
        <Route exact path="/" component={LandingPage} />
        <Route path="/login" component={Login} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/application" component={ApplicationControl} />
      </Container>
    </div>
  );
};
