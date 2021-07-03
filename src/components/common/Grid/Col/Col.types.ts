import React from "react";

export interface ColProps {
  cols?: "1" | "2" | "3";
  justify?: "start" | "center" | "end";
  align?: "start" | "center" | "end";
  children: React.ReactNode;
}

export interface PropsStyles {
  justifyContent?: string;
  alignItems?: string;
}
