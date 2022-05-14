import React from "react";

export interface IconButtonProps {
  className?: string;
  icon: React.ReactNode;
  text?: string;
  onClick?: () => void;
}
