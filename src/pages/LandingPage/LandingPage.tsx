import { Row, Col } from "../../components/common/Grid";
import "./LandingPage.scss";

export const LandingPage = () => {
  document.title = "Etienne Thompson - Admin Center - Home";
  document.documentElement.className = "theme-light";

  return (
    <div className="landing-page-content">
      <Row>
        <Col>
          <h1>Welcome to the Etienne Thompson Admin Center</h1>
          <p className="landing-page-description">
            This site is the administrative center for the ecosystem of apps on
            the etiennethompson.com domain. On this site I can see a dashboard
            overview of the status of different applications, add users to the
            ecosystem, and check the data stored for each of the applications.
          </p>
          <div className="horizontal-break"></div>
          <p className="landing-page-description">
            You can check out more about me here:{" "}
            <a href="http://etiennethompson.com">etiennethompson.com</a>
            <br />
            You can check out the code for this project here:{" "}
            <a href="https://github.com/EtienneThompson/admin.etiennethompson.com">
              Github
            </a>
          </p>
        </Col>
      </Row>
    </div>
  );
};
