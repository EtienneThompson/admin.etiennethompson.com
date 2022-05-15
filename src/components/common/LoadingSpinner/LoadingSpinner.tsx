import React from "react";
import { LoadingSpinnerProps } from "./LoadingSpinner.types";
import "./LoadingSpinner.scss";

export const LoadingSpinner: React.FunctionComponent<LoadingSpinnerProps> = (
  props: LoadingSpinnerProps
) => {
  const constructClassName = (): string => {
    let cName = "loading-spinner-container";
    if (props.className) {
      cName += " " + props.className;
    }
    if (props.size) {
      cName += " " + props.size;
    }
    return cName;
  };

  return <div className={constructClassName()}></div>;
};
