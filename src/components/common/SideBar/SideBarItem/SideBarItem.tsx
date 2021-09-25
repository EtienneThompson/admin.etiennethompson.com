import { FunctionComponent } from "react";
import { SideBarItemProps } from "./SideBarItem.types";
import "./SideBarItem.scss";

export const SideBarItem: FunctionComponent<SideBarItemProps> = (
  props: SideBarItemProps
) => {
  const { children } = props;
  return (
    <div
      className="side-bar-item"
      onClick={() => props.onClick && props.onClick()}
    >
      {children}
    </div>
  );
};
