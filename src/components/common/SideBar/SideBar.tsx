import { FunctionComponent } from "react";
import { Row } from "../Grid";
import { SideBarProps } from "./SideBar.types";
import "./SideBar.scss";

export const SideBar: FunctionComponent<SideBarProps> = (
  props: SideBarProps
) => {
  const { children } = props;
  return (
    <div className="side-bar-container">
      {children &&
        children.map((child, index) => {
          return (
            <Row key={`sidebar-item-${index}`} justify="flex-start">
              {child}
            </Row>
          );
        })}
    </div>
  );
};
