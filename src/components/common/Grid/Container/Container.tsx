import React from "react";
import { ContainerProps } from "./Container.types";
import "./Container.scss";

export const Container: React.FunctionComponent<ContainerProps> = (
  props: ContainerProps
) => {
  return (
    <div className={`container-container ${props.className}`}>
      {props.children}
    </div>
  );
};
