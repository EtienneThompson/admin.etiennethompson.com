import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Toolbar } from "./components/common/Toolbar";
import { Container } from "./components/common/Grid";

import { readFromLocalStorage } from "./utils/localStorage";
import { LocalStorageKey } from "./types";
import { login, logout } from "./store/actions";
import "./App.scss";

export const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  React.useEffect(() => {
    const clientId = readFromLocalStorage(LocalStorageKey.ClientId);
    const isUser = readFromLocalStorage(LocalStorageKey.IsUser) === "true";
    const isAdmin = readFromLocalStorage(LocalStorageKey.IsAdmin) === "true";
    if (clientId && isUser && isAdmin) {
      dispatch(login(clientId, isUser, isAdmin));
    }
  }, [dispatch]);

  const onLogoutButtonClicked = () => {
    dispatch(logout());
    navigate("/logout?reason=0");
  };

  return (
    <div className="App">
      <Container>
        <Toolbar onLogoutButtonClicked={onLogoutButtonClicked} />
        <Outlet />
      </Container>
    </div>
  );
};
