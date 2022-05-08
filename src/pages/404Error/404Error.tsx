import React from "react";
import { Error404Props } from "./404Error.types";
import "./404Error.scss";
import { Col } from "../../components/common/Grid";

export const Error404: React.FunctionComponent<Error404Props> = (
  props: Error404Props
) => {
  document.title = "Etienne Thompson - Admin Center";
  document.documentElement.className = "theme-light";

  return (
    <div className="error-404-container">
      <Col>
        <h1 className="error-404-title">404 - Not Found</h1>
        <p className="error-404-description">
          That's not a page on this site! Did you go to the right URL?
        </p>
      </Col>
    </div>
  );
};
