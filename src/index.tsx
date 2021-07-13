import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import { BrowserRouter, Route } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { Login } from "./pages/Login";
import { ApplicationControl } from "./pages/ApplicationControl";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Route exact path="/" component={LandingPage} />
      <Route path="/login" component={Login} />
      <Route path="/application" component={ApplicationControl} />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
