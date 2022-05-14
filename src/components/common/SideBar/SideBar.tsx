import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import { Row } from "../Grid";
import { IconButton } from "../IconButton";
import { SideBarProps } from "./SideBar.types";
import { AdminStore } from "../../../store/types";
import { setShowMenu } from "../../../store/actions";
import "./SideBar.scss";

export const SideBar: React.FunctionComponent<SideBarProps> = (
  props: SideBarProps
) => {
  const { children } = props;
  const dispatch = useDispatch();

  const showMenu = useSelector((state: AdminStore) => state.showMenu);

  const onCloseButtonClicked = () => {
    dispatch(setShowMenu(false));
  };

  return (
    <div
      className={`side-bar-container ${props.className} ${
        showMenu && "display-menu"
      }`}
    >
      {showMenu && (
        <Row className="menu-control-bar" justify="end">
          <IconButton icon={<IoClose />} onClick={onCloseButtonClicked} />
        </Row>
      )}
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
