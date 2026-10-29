import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BrandMark } from "../../components/common/BrandMark";
import { Button, buttonClassName } from "../../components/common/Button";
import {
  ArrowRightIcon,
  ExternalLinkIcon,
  LogInIcon,
} from "../../components/common/Icons";
import { SplashCard } from "../../components/common/SplashCard";
import { AdminStore } from "../../store/types";
import { redirectToLogin } from "../../utils/session";
import { useDocumentTitle } from "../../utils/useDocumentTitle";
import "./LandingPage.scss";

export const LandingPage = () => {
  useDocumentTitle("Home");

  const isLoggedIn = useSelector((state: AdminStore) => state.isLoggedIn);

  return (
    <SplashCard
      wide
      icon={<BrandMark size={56} />}
      iconVariant="plain"
      title="The control center for my apps"
      description="admin.etiennethompson.com is where I manage the ecosystem of apps on the etiennethompson.com domain."
      footer={
        <span>
          Only administrators can sign in. Looking for something else? Visit{" "}
          <a href="https://etiennethompson.com">etiennethompson.com</a>.
        </span>
      }
    >
      <ul className="landing-page-points">
        <li>
          <strong>See everything at a glance.</strong> A dashboard overview of
          the data behind each application.
        </li>
        <li>
          <strong>Manage access.</strong> Add users and applications, and
          decide who can sign in to what.
        </li>
        <li>
          <strong>Edit the data.</strong> Browse, search, and update the records
          each application stores.
        </li>
      </ul>
      <div className="landing-page-links">
        {isLoggedIn ? (
          <Link to="/dashboard" className={buttonClassName("primary", true)}>
            Open dashboard
            <ArrowRightIcon />
          </Link>
        ) : (
          <Button fullWidth icon={<LogInIcon />} onClick={redirectToLogin}>
            Sign in
          </Button>
        )}
        <a
          href="https://github.com/EtienneThompson/admin.etiennethompson.com"
          className={buttonClassName("secondary", true)}
        >
          View the code
          <ExternalLinkIcon />
        </a>
      </div>
    </SplashCard>
  );
};
