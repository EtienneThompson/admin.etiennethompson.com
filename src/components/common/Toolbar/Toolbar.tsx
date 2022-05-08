import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { AdminStore } from "../../../store/types";
import { Button } from "../Button";
import { Row, Col } from "../Grid";
import { ToolbarProps } from "./Toolbar.types";
import "./Toolbar.scss";

export const Toolbar: React.FunctionComponent<ToolbarProps> = (
  props: ToolbarProps
) => {
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state: AdminStore) => state.isLoggedIn);

  const onTitleTextClicked = () => {
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  const onLoginButtonClicked = () => {
    window.open(
      `${process.env.REACT_APP_LOGIN_ENDPOINT}/login?appid=${process.env.REACT_APP_APPLICATION_ID}&redirectBase=${process.env.REACT_APP_LOGIN_REDIRECT}`,
      "_self"
    );
  };

  return (
    <div className="toolbar-container">
      <Row>
        <Col cols="1" align="start">
          <div onClick={onTitleTextClicked} className="title">
            Admin Center
          </div>
        </Col>
        <Col cols="4" align="end">
          {isLoggedIn ? (
            <Button onClick={props.onLogoutButtonClicked}>Logout</Button>
          ) : (
            <Button onClick={onLoginButtonClicked}>Login</Button>
          )}
        </Col>
      </Row>
    </div>
  );
};
