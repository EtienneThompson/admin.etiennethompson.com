import React from "react";
import { Row } from "../Grid";
import { AdminTableProps } from "./AdminTable.types";
import "./AdminTable.scss";
import { getFirstValue, getObjValue } from "./AdminTable.utils";

export const AdminTable: React.FunctionComponent<AdminTableProps> = (
  props: AdminTableProps
) => {
  const [hoveringHeader, setHoveringHeader] = React.useState(-1);
  const [sortDirections, setSortDirections] = React.useState<boolean[]>([]);

  React.useEffect(() => {
    let dirs: boolean[] = [];
    props.headers.map(() => dirs.push(true));
    setSortDirections(dirs);
  }, [props.headers]);

  const onHoverHeader = (index: number) => {
    setHoveringHeader(index);
  };

  const onEndHoverHeader = () => {
    setHoveringHeader(-1);
  };

  return (
    <table>
      <thead>
        <tr>
          {props.headers.map((headerInfo, index) => (
            <th
              key={headerInfo.text}
              onClick={() => {
                if (props.onHeaderClick) {
                  let dir = sortDirections[index];
                  let updatedDirs = [...sortDirections];
                  // Flip the boolean for that value for the next sort click.
                  updatedDirs[index] = !updatedDirs[index];
                  setSortDirections(updatedDirs);
                  props.onHeaderClick(headerInfo, dir);
                }
              }}
              onMouseOver={() => onHoverHeader(index)}
              onMouseOut={onEndHoverHeader}
            >
              <Row>
                <div className="admin-table-header-text">
                  {headerInfo.text}
                </div>
                <div className="admin-table-header-sort-char">
                  {hoveringHeader === index && sortDirections[index] && (
                    <span>&uarr;</span>
                  )}
                  {hoveringHeader === index && !sortDirections[index] && (
                    <span>&darr;</span>
                  )}
                </div>
              </Row>
            </th>
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
};
