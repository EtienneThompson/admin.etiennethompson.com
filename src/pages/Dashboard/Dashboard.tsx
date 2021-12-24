import React from "react";
import { useSelector } from "react-redux";
import {
  SideBar,
  SideBarItem,
  SideBarTitle,
} from "../../components/common/SideBar";
import { Col, Container } from "../../components/common/Grid";
import { UsersEditor } from "../../components/UsersEditor";
import { ApplicationsEditor } from "../../components/ApplicationsEditor";
import { ApplicationUsersEditor } from "../../components/ApplicationUsersEditor";
import { AdminStore } from "../../store/types";
import { DashboardProps } from "./Dashboard.types";
import "./Dashboard.scss";

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
    } else if (currentEditor === "ApplicationUsersEditor") {
      return <ApplicationUsersEditor />;
    } else {
      return (
        <div
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          unknown
        </div>
      );
    }
  }, [currentEditor]);

  return (
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
      <Container>
        <Col>{renderEditor}</Col>
      </Container>
    </div>
  );
};
