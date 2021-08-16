import React from "react";

export interface RowProps {
  justify?: "start" | "flex-start" | "center" | "end";
  align?: "start" | "center" | "end";
  children: React.ReactNode;
}

export interface PropStyles {
  justifyContent?: string;
  alignItems?: string;
}
