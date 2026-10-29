import React from "react";
import "./SplashCard.scss";

export interface SplashCardProps {
  title: string;
  description?: React.ReactNode;
  // Shown in a badge above the title.
  icon?: React.ReactNode;
  iconVariant?: "primary" | "success" | "danger" | "plain";
  // Shown under a divider at the bottom of the card.
  footer?: React.ReactNode;
  wide?: boolean;
  children?: React.ReactNode;
}

export const SplashCard = ({
  title,
  description,
  icon,
  iconVariant = "primary",
  footer,
  wide = false,
  children,
}: SplashCardProps) => {
  return (
    <section className={`splash-card ${wide ? "splash-card--wide" : ""}`}>
      <header className="splash-card-header">
        {icon && (
          <div className={`splash-card-icon splash-card-icon--${iconVariant}`}>
            {icon}
          </div>
        )}
        <h1 className="splash-card-title">{title}</h1>
        {description && (
          <p className="splash-card-description">{description}</p>
        )}
      </header>
      {children && <div className="splash-card-body">{children}</div>}
      {footer && <footer className="splash-card-footer">{footer}</footer>}
    </section>
  );
};
