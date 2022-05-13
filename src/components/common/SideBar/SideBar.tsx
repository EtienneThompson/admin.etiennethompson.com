import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row } from "../Grid";
import { SideBarProps } from "./SideBar.types";
import "./SideBar.scss";
import { AdminStore } from "../../../store/types";
import { Button } from "../Button";
import { setShowMenu } from "../../../store/actions";

export const SideBar: React.FunctionComponent<SideBarProps> = (
  props: SideBarProps
) => {
  const { children } = props;
  const dispatch = useDispatch();

  const showMenu = useSelector((state: AdminStore) => state.showMenu);

  React.useEffect(() => {
    if (showMenu) {
      let container = document.getElementById("side-bar-component");
      if (container) {
        console.log("focusing side bar");
        container.focus();
      }
    }
  }, [showMenu]);

  const onCloseButtonClicked = () => {
    dispatch(setShowMenu(false));
  };

  return (
    <div
      className={`side-bar-container ${props.className} ${
        showMenu && "display-menu"
      }`}
      id="side-bar-container"
    >
      {showMenu && (
        <Row className="menu-control-bar" justify="end">
          <Button onClick={onCloseButtonClicked}>Close</Button>
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
