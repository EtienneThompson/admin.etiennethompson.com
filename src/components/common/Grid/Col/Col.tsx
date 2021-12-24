import { FunctionComponent } from "react";
import { ColProps, PropsStyles } from "./Col.types";
import "./Col.scss";

export const Col: FunctionComponent<ColProps> = (props: ColProps) => {
  const propStyles = (): PropsStyles => {
    let styles = {} as PropsStyles;
    if (props.justify) {
      styles.justifyContent = props.justify;
    }
    if (props.align) {
      styles.alignItems = props.align;
    }
    return styles;
  };

  return (
    <div
      className={`col-container col-${
        props.cols === undefined ? "1" : props.cols
      }`}
      style={propStyles()}
    >
      {props.children}
    </div>
  );
};
