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
  const isLoggedIn = useSelector((state: AdminStore) => state.isLoggedIn);

  const onLoginButtonClicked = () => {
    window.open(
      `${process.env.REACT_APP_LOGIN_ENDPOINT}/login?appid=${process.env.REACT_APP_APPLICATION_ID}&redirectBase=${process.env.REACT_APP_LOGIN_REDIRECT}`,
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
          {isLoggedIn ? (
            <Button onClick={onLogoutButtonClicked}>Logout</Button>
          ) : (
            <Button onClick={onLoginButtonClicked}>Login</Button>
          )}
        </Col>
      </Row>
    </div>
  );
};
