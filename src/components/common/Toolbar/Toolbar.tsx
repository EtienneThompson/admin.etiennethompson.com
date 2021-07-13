import { Button } from "../Button";
import { Row, Col } from "../Grid";
import "./Toolbar.scss";

export const Toolbar = () => {
  const onButtonClicked = () => {
    window.open(
      "http://localhost:4000?appid=aaaabbbb-cccc-dddd-eeee-ffffgggghhhh",
      "_self"
    );
  };

  return (
    <div className="toolbar-container">
      <Row>
        <Col cols="2" align="start">
          <div className="title">Etienne Thompson Admin Center</div>
        </Col>
        <Col cols="2" align="end">
          <Button onClick={onButtonClicked}>Login</Button>
        </Col>
      </Row>
    </div>
  );
};
