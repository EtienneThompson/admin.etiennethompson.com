import React from "react";
import { CardProps } from "./Card.types";
import "./Card.scss";

export const Card: React.FunctionComponent<CardProps> = (props: CardProps) => {
  return (
    <div className={`card-container ${props.className && props.className}`}>
      {props.children}
    </div>
  );
};
