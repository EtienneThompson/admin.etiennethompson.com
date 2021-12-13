import React, { FunctionComponent } from "react";
import { Row } from "../Grid";
import { Button } from "../Button";
import { AdminElementEditorProps } from "./AdminElementEditor.types";
import "./AdminElementEditor.scss";

export const AdminElementEditor: FunctionComponent<AdminElementEditorProps> = (
  props: AdminElementEditorProps
) => {
  return (
    <div>
      {props.elements.map((element, index) => {
        if (element.component === "text") {
          return (
            <Row key={`${element.id}-${index}`}>
              <div style={{ padding: "5px" }}>{element.label + ":"}</div>
              <input
                type="text"
                value={element.value.toString()}
                onChange={element.onChange}
              />
            </Row>
          );
        } else if (element.component === "select") {
          return (
            <Row key={`${element.id}-${index}`}>
              <div style={{ padding: "5px" }}>{element.label + ":"}</div>
              <select
                name={element.id}
                id={element.id}
                onChange={element.onChange}
              >
                {element.options &&
                  element.options.map((option, index) => (
                    <option key={option.id} value={option.value}>
                      {option.text}
                    </option>
                  ))}
              </select>
            </Row>
          );
        } else if (element.component === "checkbox") {
          return (
            <Row key={`${element.id}-${index}`}>
              <div style={{ padding: "5px" }}>{element.label + ":"}</div>
              <input type="checkbox" onChange={element.onChange} />
            </Row>
          );
        } else {
          return <Row key={`${element.id}-${index}`}>{"what?"}</Row>;
        }
      })}
      <Row>
        <Button>Save</Button>
      </Row>
    </div>
  );
};
