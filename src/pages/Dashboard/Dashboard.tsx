import React from "react";
import {
  SideBar,
  SideBarItem,
  SideBarTitle,
} from "../../components/common/SideBar";
import { AdminDashboard } from "../../components/AdminDashboard";
import { UsersEditor } from "../../components/UsersEditor";
import { Col, Container } from "../../components/common/Grid";
import { ApplicationsEditor } from "../../components/ApplicationsEditor";
import { ApplicationUsersEditor } from "../../components/ApplicationUsersEditor";
import { DashboardProps } from "./Dashboard.types";
import "./Dashboard.scss";

export const Dashboard: React.FunctionComponent<DashboardProps> = (
  props: DashboardProps
) => {
  document.title = "Etienne Thompson - Dashboard";
  document.documentElement.className = "theme-light";
  const [currentEditor, setCurrentEditor] = React.useState("DashboardEditor");

  const renderEditor = React.useMemo(() => {
    if (currentEditor === "UsersEditor") {
      return <UsersEditor />;
    } else if (currentEditor === "ApplicationsEditor") {
      return <ApplicationsEditor />;
    } else if (currentEditor === "ApplicationUsersEditor") {
      return <ApplicationUsersEditor />;
    } else {
      return <AdminDashboard />;
    }
  }, [currentEditor]);

  return (
    <div className={"dashboard-container"}>
      <SideBar className="dashboard-sidebar">
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
      <Container>
        <Col>{renderEditor}</Col>
      </Container>
    </div>
  );
};
