import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { store } from "./store/store";
import reportWebVitals from "./reportWebVitals";
import { LandingPage } from "./pages/LandingPage";
import { Login } from "./pages/Login";
import { Logout } from "./pages/Logout";
import { Dashboard } from "./pages/Dashboard";
import { ApplicationControl } from "./pages/ApplicationControl";
import { Error404 } from "./pages/404Error";
import "./index.scss";
import { UsersEditor } from "./pages/UsersEditor";
import { ApplicationsEditor } from "./pages/ApplicationsEditor";
import { ApplicationUsersEditor } from "./pages/ApplicationUsersEditor";
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
          {/* <Route path="admin/users" element={<UsersEditor />} />
          <Route path="admin/applications" element={<ApplicationsEditor />} />
          <Route
            path="admin/applicationusers"
            element={<ApplicationUsersEditor />}
          /> */}
          <Route path="application" element={<ApplicationControl />} />
          <Route path="*" element={<Error404 />} />
          <Route path="test/:elementId" element={<AdminEdtorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
