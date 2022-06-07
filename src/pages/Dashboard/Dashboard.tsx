import React from "react";
import { AdminDashboard } from "../../components/AdminDashboard";
import { Col, Container } from "../../components/common/Grid";
import { DashboardProps } from "./Dashboard.types";
import "./Dashboard.scss";
import { AdminNavBar } from "../../components/AdminNavBar/AdminNavBar";

export const Dashboard: React.FunctionComponent<DashboardProps> = (
  props: DashboardProps
) => {
  document.title = "Etienne Thompson - Admin Center - Dashboard";
  document.documentElement.className = "theme-light";

  return (
    <div className="dashboard-container">
      <AdminNavBar />
      <Container>
        <Col>
          <AdminDashboard />
        </Col>
      </Container>
    </div>
  );
};
