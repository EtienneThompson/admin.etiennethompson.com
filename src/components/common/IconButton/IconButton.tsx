import React from "react";
import { IconButtonProps } from "./IconButton.types";
import "./IconButton.scss";

export const IconButton: React.FunctionComponent<IconButtonProps> = (
  props: IconButtonProps
) => {
  return (
    <div
      className={`icon-button-container ${props.className}`}
      onClick={() => props.onClick && props.onClick()}
    >
      {props.icon}
      {props.text && <span>&nbsp;{props.text}</span>}
    </div>
  );
};
