import React from "react";
import "./PageHeader.scss";

export interface PageHeaderProps {
  title: React.ReactNode;
  // Small text above the title, such as the section name or breadcrumbs.
  eyebrow?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}

// The title block at the top of an admin page.
export const PageHeader = ({
  title,
  eyebrow,
  description,
  actions,
}: PageHeaderProps) => {
  return (
    <header className="page-header">
      <div className="page-header-text">
        {eyebrow && <div className="page-header-eyebrow">{eyebrow}</div>}
        <h1 className="page-header-title">{title}</h1>
        {description && (
          <p className="page-header-description">{description}</p>
        )}
      </div>
      {actions && <div className="page-header-actions">{actions}</div>}
    </header>
  );
};
