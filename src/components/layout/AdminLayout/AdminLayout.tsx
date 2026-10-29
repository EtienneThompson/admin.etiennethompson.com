import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation } from "react-router";
import { Link } from "react-router-dom";
import { Sidebar } from "../Sidebar";
import { BrandMark } from "../../common/BrandMark";
import { Button } from "../../common/Button";
import { LockIcon, LogInIcon, MenuIcon } from "../../common/Icons";
import { SplashCard } from "../../common/SplashCard";
import { PublicLayoutShell } from "../PublicLayout";
import { setShowMenu } from "../../../store/actions";
import { AdminStore } from "../../../store/types";
import { redirectToLogin } from "../../../utils/session";
import { useDocumentTitle } from "../../../utils/useDocumentTitle";
import "./AdminLayout.scss";

// Shown in place of the console when nobody is signed in.
const SignInRequired = () => {
  useDocumentTitle("Sign in required");

  return (
    <PublicLayoutShell>
      <SplashCard
        icon={<LockIcon />}
        title="Sign in required"
        description="The admin center is only available to administrators. Sign in with your Etienne Thompson account to continue."
      >
        <Button fullWidth icon={<LogInIcon />} onClick={redirectToLogin}>
          Sign in
        </Button>
      </SplashCard>
    </PublicLayoutShell>
  );
};

// The signed in console, with the sidebar and page content.
export const AdminLayout = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const isLoggedIn = useSelector((state: AdminStore) => state.isLoggedIn);
  const showMenu = useSelector((state: AdminStore) => state.showMenu);

  // Close the mobile menu after navigating.
  React.useEffect(() => {
    dispatch(setShowMenu(false));
  }, [dispatch, location.pathname]);

  // Let escape close the mobile menu.
  React.useEffect(() => {
    if (!showMenu) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dispatch(setShowMenu(false));
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [dispatch, showMenu]);

  if (!isLoggedIn) {
    return <SignInRequired />;
  }

  return (
    <div className="admin-layout">
      <Sidebar />
      <div
        className={`admin-layout-backdrop ${
          showMenu ? "admin-layout-backdrop--visible" : ""
        }`}
        onClick={() => dispatch(setShowMenu(false))}
        aria-hidden="true"
      />
      <div className="admin-layout-main">
        <header className="admin-layout-topbar">
          <button
            type="button"
            className="admin-layout-menu-button"
            aria-label="Open menu"
            aria-controls="admin-sidebar"
            aria-expanded={showMenu}
            onClick={() => dispatch(setShowMenu(true))}
          >
            <MenuIcon />
          </button>
          <Link to="/dashboard" className="admin-layout-topbar-brand">
            <BrandMark size={28} />
            <span>Admin Center</span>
          </Link>
        </header>
        <main className="admin-layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
