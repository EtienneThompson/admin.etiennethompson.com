import React from "react";
import { Badge } from "../Badge";
import { SortAscIcon, SortDescIcon, SortIcon } from "../Icons";
import { Header } from "../../../types";
import "./DataTable.scss";

export type DataRecord = { [key: string]: unknown };

export interface DataTableProps {
  headers: Header[];
  rows: DataRecord[];
  // Only rows with a value containing this text are shown.
  query?: string;
  // Called with the row's index in `rows`, not its sorted position.
  onRowClick?: (index: number) => void;
  // Shown when no rows match the query.
  noResults?: React.ReactNode;
}

type SortDirection = "asc" | "desc";

const valueToText = (value: unknown): string =>
  value === null || value === undefined ? "" : String(value);

const renderValue = (value: unknown): React.ReactNode => {
  const text = valueToText(value);
  if (text === "true") {
    return <Badge variant="success">Yes</Badge>;
  }
  if (text === "false") {
    return <Badge>No</Badge>;
  }
  if (text === "") {
    return <span className="data-table-empty">—</span>;
  }
  return text;
};

export const DataTable = ({
  headers,
  rows,
  query = "",
  onRowClick,
  noResults,
}: DataTableProps) => {
  const [sortField, setSortField] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] =
    React.useState<SortDirection>("asc");

  // Clicking a column sorts ascending, then descending.
  const onHeaderClicked = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Keep each row's original index so clicks map back to `rows`.
  const visibleRows = React.useMemo(() => {
    const search = query.trim().toLowerCase();
    let result = rows.map((row, index) => ({ row, index }));

    if (search) {
      result = result.filter(({ row }) =>
        headers.some((header) =>
          valueToText(row[header.field]).toLowerCase().includes(search)
        )
      );
    }

    if (sortField) {
      const direction = sortDirection === "asc" ? 1 : -1;
      result.sort(
        (a, b) =>
          valueToText(a.row[sortField]).localeCompare(
            valueToText(b.row[sortField]),
            undefined,
            { numeric: true, sensitivity: "base" }
          ) * direction
      );
    }

    return result;
  }, [rows, headers, query, sortField, sortDirection]);

  return (
    <div className="data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {headers.map((header) => {
              const isSorted = sortField === header.field;
              return (
                <th
                  key={header.field}
                  scope="col"
                  aria-sort={
                    isSorted
                      ? sortDirection === "asc"
                        ? "ascending"
                        : "descending"
                      : undefined
                  }
                >
                  <button
                    type="button"
                    className={`data-table-sort ${
                      isSorted ? "data-table-sort--active" : ""
                    }`}
                    onClick={() => onHeaderClicked(header.field)}
                  >
                    {header.text}
                    {isSorted ? (
                      sortDirection === "asc" ? (
                        <SortAscIcon />
                      ) : (
                        <SortDescIcon />
                      )
                    ) : (
                      <SortIcon />
                    )}
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {visibleRows.map(({ row, index }) => (
            <tr
              key={index}
              className={onRowClick ? "data-table-row--clickable" : ""}
              tabIndex={onRowClick ? 0 : undefined}
              onClick={() => onRowClick && onRowClick(index)}
              onKeyDown={(event) => {
                if (onRowClick && (event.key === "Enter" || event.key === " ")) {
                  event.preventDefault();
                  onRowClick(index);
                }
              }}
            >
              {headers.map((header) => (
                <td
                  key={header.field}
                  title={valueToText(row[header.field]) || undefined}
                >
                  {renderValue(row[header.field])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {visibleRows.length === 0 && noResults}
    </div>
  );
};
