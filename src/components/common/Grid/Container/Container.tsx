import React from "react";
import { ContainerProps } from "./Container.types";

export const Container: React.FunctionComponent<ContainerProps> = (
  props: ContainerProps
) => {
  return <div className="container-container">{props.children}</div>;
};
