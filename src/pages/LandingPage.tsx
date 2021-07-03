import { Toolbar } from "../components/common/Toolbar";
import { LandingPageContent } from "../components/LandingPage";

export const LandingPage = () => {
  document.title = "Etienne Thompson - Admin Center";
  document.documentElement.className = "theme-light";

  return (
    <div>
      <Toolbar />
      <LandingPageContent />
    </div>
  );
};
