import React from "react";
import { EyeIcon, EyeOffIcon } from "../Icons";
import "./TextField.scss";

export interface TextFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  // Shown next to the label, e.g. a "Forgot password?" link.
  labelAction?: React.ReactNode;
  hint?: string;
  error?: string;
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ id, label, labelAction, hint, error, type = "text", ...rest }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
    const isPassword = type === "password";
    const messageId = `${id}-message`;
    const message = error || hint;

    return (
      <div className={`text-field ${error ? "text-field--error" : ""}`}>
        <div className="text-field-label-row">
          <label className="text-field-label" htmlFor={id}>
            {label}
          </label>
          {labelAction}
        </div>
        <div className="text-field-control">
          <input
            ref={ref}
            id={id}
            className="text-field-input"
            type={isPassword && isPasswordVisible ? "text" : type}
            aria-invalid={error ? true : undefined}
            aria-describedby={message ? messageId : undefined}
            {...rest}
          />
          {isPassword && (
            <button
              type="button"
              className="text-field-toggle"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              aria-label={
                isPasswordVisible ? "Hide password" : "Show password"
              }
              aria-pressed={isPasswordVisible}
              disabled={rest.disabled}
            >
              {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          )}
        </div>
        {message && (
          <div id={messageId} className="text-field-message">
            {message}
          </div>
        )}
      </div>
    );
  }
);
