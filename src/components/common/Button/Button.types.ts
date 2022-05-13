import React from "react";

export interface ButtonProps {
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}
