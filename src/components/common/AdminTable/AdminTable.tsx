import { FunctionComponent } from "react";
import { AdminTableProps } from "./AdminTable.types";
import "./AdminTable.scss";
import { getFirstValue, getObjValue } from "./AdminTable.utils";

export const AdminTable: FunctionComponent<AdminTableProps> = (
  props: AdminTableProps
) => {
  const tableView = (
    <table>
      <thead>
        <tr>
          {props.headers.map((headerInfo) => (
            <th key={headerInfo.text}>{headerInfo.text}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.elements.map((element, index) => {
          return (
            <tr
              onClick={() => {
                props.onEditClick(index);
              }}
              className={"admin-table-row"}
              key={`${getFirstValue(element)}-${index}`}
            >
              {/* {elements.map((value, index) => (
              <td
                data-th={`${props.headers[index]}`}
                className={"admin-table-cell"}
                key={`${value}-${index}`}
              >
                {value.toString()}
              </td>
            ))} */}
              {props.headers.map((headerInfo, index) => {
                return (
                  <td
                    data-th={`${headerInfo.text}`}
                    className="admin-table-cell"
                    key={`${headerInfo.text}-${index}`}
                  >
                    {getObjValue(element, headerInfo.field).toString()}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  return tableView;
};
