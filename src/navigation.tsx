import React from "react";
import {
  AppsIcon,
  DashboardIcon,
  LinkIcon,
  UsersIcon,
} from "./components/common/Icons";

export interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  // Shown under the page title.
  description?: string;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

// The pages listed in the sidebar. Add new admin pages here.
export const navSections: NavSection[] = [
  {
    items: [
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: <DashboardIcon />,
        description: "An overview of the data across the ecosystem.",
      },
    ],
  },
  {
    title: "API",
    items: [
      {
        label: "Users",
        path: "/admin/users",
        icon: <UsersIcon />,
        description: "Accounts that can sign in to apps in the ecosystem.",
      },
      {
        label: "Applications",
        path: "/admin/applications",
        icon: <AppsIcon />,
        description: "Apps registered with the login service.",
      },
      {
        label: "Application users",
        path: "/admin/applicationusers",
        icon: <LinkIcon />,
        description: "Which users have access to which applications.",
      },
    ],
  },
];

// Find the sidebar entry for a path, along with its section.
export const findNavItem = (
  path: string
): { section: NavSection; item: NavItem } | undefined => {
  for (const section of navSections) {
    const item = section.items.find((item) => item.path === path);
    if (item) {
      return { section, item };
    }
  }
  return undefined;
};
