import React from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "link";

export type ButtonSize = "md" | "sm";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  // Shows a spinner and disables the button.
  isLoading?: boolean;
  icon?: React.ReactNode;
}
