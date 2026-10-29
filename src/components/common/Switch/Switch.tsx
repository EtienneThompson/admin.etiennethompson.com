import React from "react";
import "../TextField/TextField.scss";
import "./Switch.scss";

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  id: string;
  label: string;
  // Shown inside the control for each state.
  onText?: string;
  offText?: string;
}

// A checkbox drawn as an on/off toggle, laid out like the other fields.
export const Switch = ({
  id,
  label,
  onText = "Yes",
  offText = "No",
  checked,
  ...rest
}: SwitchProps) => {
  return (
    <div className="text-field">
      <div className="text-field-label-row">
        <label className="text-field-label" htmlFor={id}>
          {label}
        </label>
      </div>
      <label className="switch" htmlFor={id}>
        <span className="switch-state">{checked ? onText : offText}</span>
        <input
          id={id}
          type="checkbox"
          className="switch-input"
          checked={checked}
          {...rest}
        />
        <span className="switch-track" aria-hidden="true">
          <span className="switch-thumb" />
        </span>
      </label>
    </div>
  );
};
