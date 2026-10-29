import "./BrandMark.scss";

// The orange ET logo.
export const BrandMark = ({ size = 36 }: { size?: number }) => {
  return (
    <span
      className="brand-mark"
      style={{ width: size, height: size, fontSize: size * 0.42 }}
      aria-hidden="true"
    >
      ET
    </span>
  );
};
