import queryString from "query-string";
import { Link } from "react-router-dom";
import { Button, buttonClassName } from "../../components/common/Button";
import {
  ArrowLeftIcon,
  CheckIcon,
  ClockIcon,
  LogInIcon,
} from "../../components/common/Icons";
import { SplashCard } from "../../components/common/SplashCard";
import { redirectToLogin } from "../../utils/session";
import { useDocumentTitle } from "../../utils/useDocumentTitle";
import { extractQueryParam } from "../Login/Login.utils";

export const Logout = () => {
  useDocumentTitle("Signed out");

  // 0 means the user signed out, 1 means their session expired.
  const reason = extractQueryParam(
    queryString.parse(window.location.search),
    "reason"
  );
  const hasExpired = reason === "1";

  return (
    <SplashCard
      icon={hasExpired ? <ClockIcon /> : <CheckIcon />}
      iconVariant={hasExpired ? "primary" : "success"}
      title={hasExpired ? "Your session expired" : "You're signed out"}
      description={
        hasExpired
          ? "For your security, you've been signed out. Sign in again to pick up where you left off."
          : "You've been signed out of the admin center."
      }
    >
      <div className="splash-form-actions">
        <Button fullWidth icon={<LogInIcon />} onClick={redirectToLogin}>
          Sign in again
        </Button>
        <Link to="/" className={buttonClassName("secondary", true)}>
          <ArrowLeftIcon />
          Back to home
        </Link>
      </div>
    </SplashCard>
  );
};
