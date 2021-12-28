import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row } from "../Grid";
import { Button } from "../Button";
import { LoadingSpinner } from "../LoadingSpinner";
import { AdminElementEditorProps } from "./AdminElementEditor.types";
import { AdminStore } from "../../../store/types";
import { setIsLoading } from "../../../store/actions";
import "./AdminElementEditor.scss";

export const AdminElementEditor: FunctionComponent<AdminElementEditorProps> = (
  props: AdminElementEditorProps
) => {
  const dispatch = useDispatch();
  const [values, setValues] = React.useState([] as string[]);

  const isLoading = useSelector((state: AdminStore) => state.isLoading);

  React.useEffect(() => {
    dispatch(setIsLoading(true));
    let defaultValues = props.elements.map((element, index) => {
      if (
        element.component === "select" &&
        element.options &&
        props.newElement
      ) {
        element.options.splice(0, 0, {
          id: `---${index}`,
          value: "---",
          text: "---",
        });
      }
      return element.value.toString();
    });
    setValues(defaultValues);
    dispatch(setIsLoading(false));
  }, [props.newElement, props.elements, dispatch]);

  return (
    <div>
      {isLoading && <LoadingSpinner />}
      {!isLoading &&
        props.elements.map((element, index) => {
          if (element.component === "text") {
            return (
              <Row key={`${element.id}-${index}`}>
                <div style={{ padding: "5px" }}>{element.label + ":"}</div>
                <input
                  type="text"
                  value={values[index]}
                  onChange={(event: any) => {
                    let newValues = [...values];
                    newValues[index] = event.currentTarget.value;
                    setValues(newValues);
                  }}
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
                  value={values[index]}
                  onChange={(event: any) => {
                    let newValues = [...values];
                    newValues[index] = event.target.value;
                    setValues(newValues);
                  }}
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
                <input
                  type="checkbox"
                  checked={values[index] === "true"}
                  onChange={(event: any) => {
                    let newValues = [...values];
                    newValues[index] = event.target.checked.toString();
                    setValues(newValues);
                  }}
                />
              </Row>
            );
          } else {
            return <Row key={`${element.id}-${index}`}>{"what?"}</Row>;
          }
        })}
      <Row>
        <Button onClick={props.onBackButtonClicked}>Back</Button>
        <Button onClick={props.onDeleteButtonClicked}>Delete</Button>
        {!props.newElement && (
          <Button onClick={() => props.onSaveButtonClicked(values)}>
            Save
          </Button>
        )}
        {props.newElement && (
          <Button onClick={() => props.onSubmitButtonClicked(values)}>
            Submit
          </Button>
        )}
      </Row>
    </div>
  );
};
