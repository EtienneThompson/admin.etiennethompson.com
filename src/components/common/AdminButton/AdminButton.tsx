import React from "react";
import { useSelector } from "react-redux";
import { AdminStore } from "../../../store/types";
import { Button } from "../Button";
import { LoadingSpinner } from "../LoadingSpinner";
import { AdminButtonProps, TypeMap } from "./AdminButton.types";
import "./AdminButton.scss";
import { IconButton } from "../IconButton";

export const AdminButton: React.FunctionComponent<AdminButtonProps> = (
  props: AdminButtonProps
) => {
  const isButtonPressed = useSelector(
    (state: AdminStore) => state.isButtonPressed
  );

  const buttonType = () => {
    return (
      <Button
        className={props.className}
        onClick={() => !isButtonPressed && props.onClick && props.onClick()}
      >
        {isButtonPressed ? <LoadingSpinner /> : props.children}
      </Button>
    );
  };

  const iconButtonType = () => {
    if (isButtonPressed) {
      return (
        <Button>
          <LoadingSpinner size="small" />
        </Button>
      );
    }

    return (
      <IconButton
        icon={props.icon}
        text={props.text}
        className={props.className}
        onClick={() => !isButtonPressed && props.onClick && props.onClick()}
      />
    );
  };

  const typeMap: TypeMap = {
    "button": buttonType,
    "icon": iconButtonType,
  };

  return <>{props.type ? typeMap[props.type]() : buttonType()}</>;
};
