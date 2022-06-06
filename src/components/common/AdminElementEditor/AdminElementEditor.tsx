import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaRegTrashAlt } from "react-icons/fa";
import { BiArrowBack, BiSave, BiCheck } from "react-icons/bi";
import { Row, Col } from "../Grid";
import { AdminButton } from "../AdminButton";
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
              <Row className="element-field" key={`${element.id}-${index}`}>
                <Col align="start">
                  <div className="element-label">{element.label + ":"}</div>
                  <div className="input-none">{element.value.toString()}</div>
                </Col>
              </Row>
            );
          } else if (element.component === "text") {
            return (
              <Row className="element-field" key={`${element.id}-${index}`}>
                <Col align="start">
                  <div className="element-label">{element.label + ":"}</div>
                  <input
                    className="element-editable input-text"
                    type="text"
                    value={values[index]}
                    onChange={(event: any) => {
                      let newValues = [...values];
                      newValues[index] = event.currentTarget.value;
                      setValues(newValues);
                    }}
                  />
                </Col>
              </Row>
            );
          } else if (element.component === "select") {
            return (
              <Row className="element-field" key={`${element.id}-${index}`}>
                <Col align="start">
                  <div className="element-label">{element.label + ":"}</div>
                  <select
                    className="element-editable input-select"
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
                </Col>
              </Row>
            );
          } else if (element.component === "checkbox") {
            return (
              <Row className="element-field" key={`${element.id}-${index}`}>
                <Col align="start">
                  <div className="element-label">{element.label + ":"}</div>
                  <input
                    className="element-editable input-checkbox"
                    type="checkbox"
                    checked={values[index] === "true"}
                    onChange={(event: any) => {
                      let newValues = [...values];
                      newValues[index] = event.target.checked.toString();
                      setValues(newValues);
                    }}
                  />
                </Col>
              </Row>
            );
          } else {
            return <Row key={`${element.id}-${index}`}>{"what?"}</Row>;
          }
        })}
      <Row>
        <AdminButton
          type="icon"
          icon={<BiArrowBack />}
          text="Back"
          onClick={props.onBackButtonClicked}
        />
        {!props.newElement && (
          <AdminButton
            type="icon"
            icon={<FaRegTrashAlt />}
            text="Delete"
            onClick={props.onDeleteButtonClicked}
          />
        )}
        {!props.newElement && (
          <AdminButton
            type="icon"
            icon={<BiSave />}
            text="Save"
            onClick={() => props.onSaveButtonClicked(values)}
          />
        )}
        {props.newElement && (
          <AdminButton
            type="icon"
            icon={<BiCheck />}
            text="Submit"
            onClick={() => props.onSubmitButtonClicked(values)}
          />
        )}
      </Row>
    </div>
  );
};
