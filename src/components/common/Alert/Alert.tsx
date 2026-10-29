import React from "react";
import { AlertIcon, CheckIcon, InfoIcon } from "../Icons";
import "./Alert.scss";

export interface AlertProps {
  variant?: "error" | "success" | "info";
  children: React.ReactNode;
}

const icons = {
  error: <AlertIcon />,
  success: <CheckIcon />,
  info: <InfoIcon />,
};

export const Alert = ({ variant = "error", children }: AlertProps) => {
  return (
    <div
      className={`alert alert--${variant}`}
      role={variant === "error" ? "alert" : "status"}
    >
      {icons[variant]}
      <div>{children}</div>
    </div>
  );
};
