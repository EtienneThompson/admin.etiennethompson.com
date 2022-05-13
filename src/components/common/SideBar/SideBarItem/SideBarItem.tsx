import { FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import { SideBarItemProps } from "./SideBarItem.types";
import { setShowMenu } from "../../../../store/actions";
import "./SideBarItem.scss";

export const SideBarItem: FunctionComponent<SideBarItemProps> = (
  props: SideBarItemProps
) => {
  const { children } = props;
  const dispatch = useDispatch();

  return (
    <div
      className="side-bar-item"
      onClick={() => {
        dispatch(setShowMenu(false));
        if (props.onClick) {
          props.onClick();
        }
      }}
    >
      {children}
    </div>
  );
};
