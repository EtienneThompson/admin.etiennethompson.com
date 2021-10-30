import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../store/actions";
import { AdminStore } from "../../../store/types";
import { Button } from "../Button";
import { Row, Col } from "../Grid";
import { ToolbarProps } from "./Toolbar.types";
import "./Toolbar.scss";

export const Toolbar: React.FunctionComponent<ToolbarProps> = (
  props: ToolbarProps
) => {
  const dispatch = useDispatch();
  const clientId = useSelector((state: AdminStore) => state.clientId);

  const onLoginButtonClicked = () => {
    window.open(
      // `http://login.etiennethompson.com?appid=${process.env.REACT_APP_APPLICATION_ID}`,
      `http://localhost:4000/login?appid=${process.env.REACT_APP_APPLICATION_ID}`,
      "_self"
    );
  };

  const onLogoutButtonClicked = () => {
    dispatch(logout());
  };

  return (
    <div className="toolbar-container">
      <Row>
        <Col cols="2" align="start">
          <div className="title">Etienne Thompson Admin Center</div>
        </Col>
        <Col cols="2" align="end">
          {clientId ? (
            <Button onClick={onLogoutButtonClicked}>Logout</Button>
          ) : (
            <Button onClick={onLoginButtonClicked}>Login</Button>
          )}
        </Col>
      </Row>
    </div>
  );
};
