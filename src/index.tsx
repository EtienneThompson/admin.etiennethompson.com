import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { store } from "./store/store";
import { LandingPage } from "./pages/LandingPage";
import { Login } from "./pages/Login";
import { Logout } from "./pages/Logout";
import { Dashboard } from "./pages/Dashboard";
import { ApplicationControl } from "./pages/ApplicationControl";
import { Error404 } from "./pages/404Error";
import "./index.scss";
import { AdminEdtorPage } from "./components/AdminEditorPage";

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="" element={<LandingPage />} />
          <Route path="login" element={<Login />} />
          <Route path="logout" element={<Logout />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="admin/:elementId" element={<AdminEdtorPage />} />
          <Route path="application" element={<ApplicationControl />} />
          <Route path="*" element={<Error404 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
