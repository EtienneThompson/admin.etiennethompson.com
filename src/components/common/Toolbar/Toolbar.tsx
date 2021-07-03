import { Button } from "../Button";
import { Row, Col } from "../Grid";
import "./Toolbar.scss";

export const Toolbar = () => {
  return (
    <div className="toolbar-container">
      <Row>
        <Col cols="2" align="start">
          <div className="title">Etienne Thompson Admin Center</div>
        </Col>
        <Col cols="2" align="end">
          <Button>Login</Button>
        </Col>
      </Row>
    </div>
  );
};
