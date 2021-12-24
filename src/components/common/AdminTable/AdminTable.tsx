import React, { FunctionComponent } from "react";
import { AdminTableProps } from "./AdminTable.types";
import "./AdminTable.scss";

export const AdminTable: FunctionComponent<AdminTableProps> = (
  props: AdminTableProps
) => {
  const tableView = (
    <table>
      <thead>
        <tr>
          {props.headers.map((name) => (
            <th key={name}>{name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.elements.map((element) => (
          <tr
            onClick={() => {
              props.onEditClick(element);
            }}
            className={"admin-table-row"}
            key={`${element.id}`}
          >
            {element.values.map((value, index) => (
              <td className={"admin-table-cell"} key={`${value}-${index}`}>
                {value}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div style={{ justifyContent: "center", alignContent: "center" }}>
      {tableView}
    </div>
  );
};
