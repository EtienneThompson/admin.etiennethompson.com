import React from "react";
import { ErrorMessageProps } from "./ErrorMessage.types";
import "./ErrorMessage.scss";

export const ErrorMessage: React.FunctionComponent<ErrorMessageProps> = (
  props: ErrorMessageProps
) => {
  return <div className="error-message-container">{props.message}</div>;
};
