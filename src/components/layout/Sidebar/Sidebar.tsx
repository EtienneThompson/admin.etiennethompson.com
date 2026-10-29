import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Link, NavLink } from "react-router-dom";
import { BrandMark } from "../../common/BrandMark";
import { CloseIcon, LogOutIcon } from "../../common/Icons";
import { navSections } from "../../../navigation";
import { logout, setShowMenu } from "../../../store/actions";
import { AdminStore } from "../../../store/types";
import "./Sidebar.scss";

export const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const showMenu = useSelector((state: AdminStore) => state.showMenu);

  const onSignOutClicked = () => {
    dispatch(logout());
    navigate("/logout?reason=0");
  };

  return (
    <aside
      id="admin-sidebar"
      className={`sidebar ${showMenu ? "sidebar--open" : ""}`}
    >
      <div className="sidebar-header">
        <Link to="/dashboard" className="sidebar-brand">
          <BrandMark size={34} />
          <span className="sidebar-brand-text">
            <span className="sidebar-brand-name">Etienne Thompson</span>
            <span className="sidebar-brand-product">Admin Center</span>
          </span>
        </Link>
        <button
          type="button"
          className="sidebar-close"
          aria-label="Close menu"
          onClick={() => dispatch(setShowMenu(false))}
        >
          <CloseIcon />
        </button>
      </div>

      <nav className="sidebar-nav" aria-label="Admin">
        {navSections.map((section, index) => (
          <div className="sidebar-section" key={section.title ?? index}>
            {section.title && (
              <div className="sidebar-section-title">{section.title}</div>
            )}
            <ul className="sidebar-list">
              {section.items.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `sidebar-link ${isActive ? "sidebar-link--active" : ""}`
                    }
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-account">
          <span className="sidebar-account-avatar" aria-hidden="true">
            A
          </span>
          <span className="sidebar-account-text">
            <span className="sidebar-account-name">Administrator</span>
            <span className="sidebar-account-status">Signed in</span>
          </span>
        </div>
        <button
          type="button"
          className="sidebar-sign-out"
          onClick={onSignOutClicked}
        >
          <LogOutIcon />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
};
