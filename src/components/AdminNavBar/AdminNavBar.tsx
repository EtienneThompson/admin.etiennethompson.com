import React from "react";
import { useNavigate } from "react-router";
import { SideBar, SideBarItem, SideBarTitle } from "../common/SideBar";

export const AdminNavBar = () => {
  const navigate = useNavigate();

  return (
    <SideBar>
      <SideBarItem onClick={() => navigate("/dashboard")}>
        Dashboard
      </SideBarItem>
      <SideBarTitle>API</SideBarTitle>
      <SideBarItem onClick={() => navigate("/admin/users")}>Users</SideBarItem>
      <SideBarItem onClick={() => navigate("/admin/applications")}>
        Applications
      </SideBarItem>
      <SideBarItem onClick={() => navigate("/admin/applicationusers")}>
        ApplicationUsers
      </SideBarItem>
    </SideBar>
  );
};
