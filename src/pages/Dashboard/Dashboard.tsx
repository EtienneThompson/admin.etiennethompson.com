import React from "react";
import { Link } from "react-router-dom";
import { Alert } from "../../components/common/Alert";
import { Button } from "../../components/common/Button";
import {
  ChevronRightIcon,
  DatabaseIcon,
  RefreshIcon,
} from "../../components/common/Icons";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { PageHeader } from "../../components/common/PageHeader";
import { Panel } from "../../components/common/Panel";
import { NavItem, navSections } from "../../navigation";
import { useDocumentTitle } from "../../utils/useDocumentTitle";
import api, { errorMessage } from "../../api";
import "./Dashboard.scss";

export interface TableCounts {
  name: string;
  count: number;
}

export interface CountData {
  total: number;
  tables: TableCounts[];
}

const numberFormat = new Intl.NumberFormat();

// The editor pages, listed as shortcuts.
const editorPages: NavItem[] = navSections
  .flatMap((section) => section.items)
  .filter((item) => item.path.startsWith("/admin/"));

// Match a table name like "ApplicationUsers" to its editor page.
const editorPageForTable = (name: string): NavItem | undefined => {
  const key = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  return editorPages.find((item) => item.path === `/admin/${key}`);
};

export const Dashboard = () => {
  useDocumentTitle("Dashboard");

  const [counts, setCounts] = React.useState<CountData>({
    total: 0,
    tables: [],
  });
  const [isLoading, setIsLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState("");
  const [reloadCount, setReloadCount] = React.useState(0);

  React.useEffect(() => {
    let isCurrent = true;
    setIsLoading(true);
    setLoadError("");
    api
      .get("/admin/dashboard/count")
      .then((response) => {
        if (!isCurrent) return;
        setCounts(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        if (!isCurrent) return;
        console.error(error);
        setLoadError(errorMessage(error, "Couldn't load the table counts."));
        setIsLoading(false);
      });
    return () => {
      isCurrent = false;
    };
  }, [reloadCount]);

  const renderStats = () => {
    if (isLoading) {
      return (
        <div className="dashboard-loading">
          <LoadingSpinner />
          <span>Loading table counts…</span>
        </div>
      );
    }

    if (loadError) {
      return <Alert>{loadError}</Alert>;
    }

    return (
      <div className="dashboard-stats">
        <div className="dashboard-stat dashboard-stat--total">
          <div className="dashboard-stat-icon">
            <DatabaseIcon />
          </div>
          <div className="dashboard-stat-label">Total records</div>
          <div className="dashboard-stat-value">
            {numberFormat.format(counts.total)}
          </div>
          <div className="dashboard-stat-meta">
            Across {counts.tables.length}{" "}
            {counts.tables.length === 1 ? "table" : "tables"}
          </div>
        </div>
        {counts.tables.map((table) => {
          const share = counts.total ? (table.count / counts.total) * 100 : 0;
          const page = editorPageForTable(table.name);
          const content = (
            <>
              <div className="dashboard-stat-label">
                {page?.label ?? table.name}
              </div>
              <div className="dashboard-stat-value">
                {numberFormat.format(table.count)}
              </div>
              <div
                className="dashboard-stat-bar"
                role="img"
                aria-label={`${Math.round(share)}% of all records`}
              >
                <span style={{ width: `${share}%` }} />
              </div>
              <div className="dashboard-stat-meta">
                {Math.round(share)}% of all records
              </div>
            </>
          );

          return page ? (
            <Link
              key={table.name}
              to={page.path}
              className="dashboard-stat dashboard-stat--link"
            >
              {content}
            </Link>
          ) : (
            <div key={table.name} className="dashboard-stat">
              {content}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="What's stored across the etiennethompson.com ecosystem right now."
        actions={
          <Button
            variant="secondary"
            size="sm"
            icon={<RefreshIcon />}
            disabled={isLoading}
            onClick={() => setReloadCount(reloadCount + 1)}
          >
            Refresh
          </Button>
        }
      />

      {renderStats()}

      <Panel
        flush
        title="Manage data"
        description="Jump into one of the tables behind the API."
      >
        <ul className="dashboard-links">
          {editorPages.map((item) => (
            <li key={item.path}>
              <Link to={item.path} className="dashboard-link">
                <span className="dashboard-link-icon">{item.icon}</span>
                <span className="dashboard-link-text">
                  <span className="dashboard-link-label">{item.label}</span>
                  {item.description && (
                    <span className="dashboard-link-description">
                      {item.description}
                    </span>
                  )}
                </span>
                <ChevronRightIcon />
              </Link>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
};
