import { Row, Col } from "../../components/common/Grid";
import "./LandingPage.scss";

export const LandingPage = () => {
  document.title = "Etienne Thompson - Admin Center";
  document.documentElement.className = "theme-light";

  return (
    <div className="landing-page-content">
      <Row>
        <Col>Landing Page</Col>
      </Row>
    </div>
  );
};
