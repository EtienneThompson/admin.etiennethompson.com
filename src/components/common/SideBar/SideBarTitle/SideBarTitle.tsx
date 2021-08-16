import { FunctionComponent } from "react";
import { SideBarTitleProps } from "./SideBarTitle.types";
import "./SideBarTitle.scss";

export const SideBarTitle: FunctionComponent<SideBarTitleProps> = (
  props: SideBarTitleProps
) => {
  const { children } = props;

  return <div className="side-bar-title">{children}</div>;
};
