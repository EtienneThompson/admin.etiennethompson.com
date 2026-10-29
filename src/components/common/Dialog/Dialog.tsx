import React from "react";
import ReactDOM from "react-dom";
import "./Dialog.scss";

export interface DialogProps {
  isOpen: boolean;
  title: string;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  // Buttons shown at the bottom of the dialog.
  actions: React.ReactNode;
  onClose: () => void;
}

// A modal dialog, for confirming things like deletes.
export const Dialog = ({
  isOpen,
  title,
  description,
  icon,
  actions,
  onClose,
}: DialogProps) => {
  const dialogRef = React.useRef<HTMLDivElement>(null);
  // Kept in a ref so a new callback each render doesn't move focus around.
  const onCloseRef = React.useRef(onClose);
  onCloseRef.current = onClose;

  React.useEffect(() => {
    if (!isOpen) {
      return;
    }

    // Move focus into the dialog, and give it back when the dialog closes.
    const previousFocus = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCloseRef.current();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus();
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className="dialog-backdrop" onMouseDown={onClose}>
      <div
        ref={dialogRef}
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {icon && <div className="dialog-icon">{icon}</div>}
        <h2 id="dialog-title" className="dialog-title">
          {title}
        </h2>
        {description && <p className="dialog-description">{description}</p>}
        <div className="dialog-actions">{actions}</div>
      </div>
    </div>,
    document.body
  );
};
