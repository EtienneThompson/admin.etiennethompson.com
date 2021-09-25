import React from "react";
import { useSelector } from "react-redux";
import { Toolbar } from "../../components/common/Toolbar";
import {
  SideBar,
  SideBarItem,
  SideBarTitle,
} from "../../components/common/SideBar";
import { UsersEditor } from "../../components/UsersEditor";
import { ApplicationsEditor } from "../../components/ApplicationsEditor";
import "./Dashboard.scss";
import { AdminStore } from "../../store/types";
import { DashboardProps } from "./Dashboard.types";

export const Dashboard: React.FunctionComponent<DashboardProps> = (
  props: DashboardProps
) => {
  document.title = "Etienne Thompson - Dashboard";
  document.documentElement.className = "theme-light";
  const clientId = useSelector((state: AdminStore) => state.clientId);
  const isClientIdLoading = useSelector(
    (state: AdminStore) => state.isClientIdLoading
  );
  const [currentEditor, setCurrentEditor] = React.useState("DashboardEditor");

  React.useEffect(() => {
    if (!isClientIdLoading && !clientId) {
      props.history.push("/");
    }
  }, [isClientIdLoading, clientId, props.history]);

  const renderEditor = React.useMemo(() => {
    if (currentEditor === "UsersEditor") {
      return <UsersEditor />;
    } else if (currentEditor === "ApplicationsEditor") {
      return <ApplicationsEditor />;
    } else {
      return <div style={{ width: "100%" }}>unknown</div>;
    }
  }, [currentEditor]);

  return (
    <div>
      <Toolbar />
      <div className={"dashboard-container"}>
        <SideBar>
          <SideBarItem onClick={() => setCurrentEditor("DashboardEditor")}>
            Dashboard
          </SideBarItem>
          <SideBarTitle>API</SideBarTitle>
          <SideBarItem onClick={() => setCurrentEditor("UsersEditor")}>
            Users
          </SideBarItem>
          <SideBarItem onClick={() => setCurrentEditor("ApplicationsEditor")}>
            Applications
          </SideBarItem>
          <SideBarItem
            onClick={() => setCurrentEditor("ApplicationUsersEditor")}
          >
            ApplicationUsers
          </SideBarItem>
        </SideBar>
        {renderEditor}
      </div>
    </div>
  );
};
