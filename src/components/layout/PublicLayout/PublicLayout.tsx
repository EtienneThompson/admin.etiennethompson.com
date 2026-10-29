import React from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router";
import { Link } from "react-router-dom";
import { BrandMark } from "../../common/BrandMark";
import { Button, buttonClassName } from "../../common/Button";
import { ArrowRightIcon, LogInIcon } from "../../common/Icons";
import { AdminStore } from "../../../store/types";
import { redirectToLogin } from "../../../utils/session";
import "./PublicLayout.scss";

// The branded gradient page used by login.etiennethompson.com, for pages
// outside the admin console.
export const PublicLayoutShell = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const isLoggedIn = useSelector((state: AdminStore) => state.isLoggedIn);

  return (
    <div className="public-layout">
      <header className="public-layout-header">
        <Link to="/" className="public-layout-brand">
          <BrandMark size={34} />
          <span className="public-layout-brand-name">Etienne Thompson</span>
          <span className="public-layout-brand-divider" aria-hidden="true" />
          <span className="public-layout-brand-product">Admin</span>
        </Link>
        {isLoggedIn ? (
          <Link
            to="/dashboard"
            className={buttonClassName("primary", false, "", "sm")}
          >
            Open dashboard
            <ArrowRightIcon />
          </Link>
        ) : (
          <Button size="sm" icon={<LogInIcon />} onClick={redirectToLogin}>
            Sign in
          </Button>
        )}
      </header>
      <main className="public-layout-main">
        {children}
      </main>
      <footer className="public-layout-footer">
        <span>© {new Date().getFullYear()} Etienne Thompson</span>
        <span aria-hidden="true">·</span>
        <a href="https://etiennethompson.com">etiennethompson.com</a>
        <span aria-hidden="true">·</span>
        <a href="https://github.com/EtienneThompson/admin.etiennethompson.com">
          Source
        </a>
      </footer>
    </div>
  );
};

export const PublicLayout = () => (
  <PublicLayoutShell>
    <Outlet />
  </PublicLayoutShell>
);
