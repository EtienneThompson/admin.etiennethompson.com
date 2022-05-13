import { FunctionComponent } from "react";
import { ButtonProps } from "./Button.types";
import "./Button.scss";

export const Button: FunctionComponent<ButtonProps> = (props: ButtonProps) => {
  return (
    <div
      className={`button-container ${props.className && props.className}`}
      onClick={props.onClick}
    >
      {props.children}
    </div>
  );
};
