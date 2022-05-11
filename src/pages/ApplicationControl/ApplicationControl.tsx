import { Row, Col } from "../../components/common/Grid";
import "./ApplicationControl.scss";

export const ApplicationControl = () => {
  document.title = "Etienen Thompson - Admin Center - Application Control";
  document.documentElement.className = "theme-light";

  return (
    <div className="application-control-content">
      <Row>
        <Col>ApplicationControl</Col>
      </Row>
    </div>
  );
};
