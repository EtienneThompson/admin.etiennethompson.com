import { Toolbar } from "../components/common/Toolbar";

export const ApplicationControl = () => {
  document.title = "Etienen Thompson - Admin Center";
  document.documentElement.className = "theme-light";

  return (
    <div>
      <Toolbar />
      <div>ApplicationControl</div>
    </div>
  );
};
