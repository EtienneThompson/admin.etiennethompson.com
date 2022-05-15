import React from "react";

export interface AdminButtonProps {
  className?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  type?: string;
  text?: string;
}

export interface TypeMap {
  [key: string]: () => JSX.Element;
}
