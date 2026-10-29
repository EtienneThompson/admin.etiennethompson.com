import React from "react";
import { SortDescIcon } from "../Icons";
import "../TextField/TextField.scss";
import "./SelectField.scss";

export interface SelectOption {
  value: string;
  text: string;
}

export interface SelectFieldProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: string;
  options: SelectOption[];
  // Shown as a disabled first option when nothing is selected yet.
  placeholder?: string;
  hint?: string;
}

export const SelectField = ({
  id,
  label,
  options,
  placeholder,
  hint,
  ...rest
}: SelectFieldProps) => {
  const messageId = `${id}-message`;

  return (
    <div className="text-field">
      <div className="text-field-label-row">
        <label className="text-field-label" htmlFor={id}>
          {label}
        </label>
      </div>
      <div className="text-field-control">
        <select
          id={id}
          className="text-field-input select-field-input"
          aria-describedby={hint ? messageId : undefined}
          {...rest}
        >
          {placeholder !== undefined && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.text}
            </option>
          ))}
        </select>
        <span className="select-field-chevron">
          <SortDescIcon />
        </span>
      </div>
      {hint && (
        <div id={messageId} className="text-field-message">
          {hint}
        </div>
      )}
    </div>
  );
};
