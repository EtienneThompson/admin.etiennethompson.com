import React from "react";
import { CardTitleProps } from "./CardTitle.types";
import "./CardTitle.scss";

export const CardTitle: React.FunctionComponent<CardTitleProps> = (
  props: CardTitleProps
) => {
  return (
    <div className="card-title-container" style={{ textAlign: props.align }}>
      {props.children}
    </div>
  );
};
