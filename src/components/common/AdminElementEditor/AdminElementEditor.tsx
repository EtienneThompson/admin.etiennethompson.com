import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaRegTrashAlt } from "react-icons/fa";
import { BiArrowBack, BiSave, BiCheck } from "react-icons/bi";
import { Row } from "../Grid";
import { IconButton } from "../IconButton";
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
          if (element.editable === false) {
            return (
              <Row key={`${element.id}-${index}`}>
                <div style={{ padding: "5px" }}>{element.label + ":"}</div>
                <div>{element.value.toString()}</div>
              </Row>
            );
          } else if (element.component === "text") {
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
        <IconButton
          icon={<BiArrowBack />}
          text="Back"
          onClick={props.onBackButtonClicked}
        />
        {!props.newElement && (
          <IconButton
            icon={<FaRegTrashAlt />}
            text="Delete"
            onClick={props.onDeleteButtonClicked}
          />
        )}
        {!props.newElement && (
          <IconButton
            icon={<BiSave />}
            text="Save"
            onClick={() => props.onSaveButtonClicked(values)}
          />
        )}
        {props.newElement && (
          <IconButton
            icon={<BiCheck />}
            text="Submit"
            onClick={() => props.onSubmitButtonClicked(values)}
          />
        )}
      </Row>
    </div>
  );
};
