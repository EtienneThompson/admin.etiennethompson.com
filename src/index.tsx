import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { store } from "./store/store";
import { AdminLayout } from "./components/layout/AdminLayout";
import { PublicLayout } from "./components/layout/PublicLayout";
import { LandingPage } from "./pages/LandingPage";
import { Login } from "./pages/Login";
import { Logout } from "./pages/Logout";
import { Dashboard } from "./pages/Dashboard";
import { AdminEditor } from "./pages/AdminEditor";
import { ApplicationControl } from "./pages/ApplicationControl";
import { Error404 } from "./pages/404Error";
import "@fontsource-variable/inter";
import "./index.scss";

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        {/* Pages anyone can see, on the branded gradient background. */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="login" element={<Login />} />
          <Route path="logout" element={<Logout />} />
          <Route path="*" element={<Error404 />} />
        </Route>
        {/* The admin console, which needs an admin session. */}
        <Route element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="admin/:elementId" element={<AdminEditor />} />
          <Route path="application" element={<ApplicationControl />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
