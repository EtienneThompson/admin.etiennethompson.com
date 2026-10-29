import React from "react";
import "./Badge.scss";

export interface BadgeProps {
  variant?: "neutral" | "success" | "danger" | "info";
  children: React.ReactNode;
}

export const Badge = ({ variant = "neutral", children }: BadgeProps) => {
  return <span className={`badge badge--${variant}`}>{children}</span>;
};
