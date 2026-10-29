import React from "react";
import "./Panel.scss";

export interface PanelProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  // Shown on the right side of the header, e.g. buttons or a search box.
  actions?: React.ReactNode;
  // Shown under a divider at the bottom of the panel.
  footer?: React.ReactNode;
  // Remove the body padding, for content like tables that runs edge to edge.
  flush?: boolean;
  className?: string;
  children?: React.ReactNode;
}

// A white content section on the admin background.
export const Panel = ({
  title,
  description,
  actions,
  footer,
  flush = false,
  className = "",
  children,
}: PanelProps) => {
  const hasHeader = title || description || actions;

  return (
    <section className={`panel ${className}`}>
      {hasHeader && (
        <header className="panel-header">
          <div className="panel-heading">
            {title && <h2 className="panel-title">{title}</h2>}
            {description && (
              <p className="panel-description">{description}</p>
            )}
          </div>
          {actions && <div className="panel-actions">{actions}</div>}
        </header>
      )}
      {children && (
        <div className={`panel-body ${flush ? "panel-body--flush" : ""}`}>
          {children}
        </div>
      )}
      {footer && <footer className="panel-footer">{footer}</footer>}
    </section>
  );
};
