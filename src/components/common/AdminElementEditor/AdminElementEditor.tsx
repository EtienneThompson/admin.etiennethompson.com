import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaRegTrashAlt } from "react-icons/fa";
import { BiArrowBack, BiSave, BiCheck } from "react-icons/bi";
import { Row, Col } from "../Grid";
import { AdminButton } from "../AdminButton";
import { LoadingSpinner } from "../LoadingSpinner";
import { AdminStore } from "../../../store/types";
import { EditingComponent } from "../../../types";
import { AdminElementEditorProps } from "./AdminElementEditor.types";
import { setIsLoading } from "../../../store/actions";
import { hashString } from "../../../utils/hash";
import "./AdminElementEditor.scss";

export const AdminElementEditor: FunctionComponent<AdminElementEditorProps> = (
  props: AdminElementEditorProps
) => {
  const dispatch = useDispatch();
  const [values, setValues] = React.useState([] as EditingComponent[]);

  const isLoading = useSelector((state: AdminStore) => state.isLoading);

  React.useEffect(() => {
    dispatch(setIsLoading(true));
    props.elements.map((element, index) => {
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

    if (props.newElement) {
      props.newFields.map(
        (field) =>
          (props.elements.filter(
            (elem) => elem.label === field.text
          )[0].editable = true)
      );
    } else {
      props.editableFields.map(
        (field) =>
          (props.elements.filter(
            (elem) => elem.label === field.text
          )[0].editable = field.edit)
      );
    }

    setValues(props.elements);
    dispatch(setIsLoading(false));
  }, [
    props.newElement,
    props.elements,
    props.editableFields,
    props.newFields,
    dispatch,
  ]);

  return (
    <div>
      {isLoading && <LoadingSpinner />}
      {!isLoading && values.length !== 0 && (
        <>
          {props.elements.map((element, index) => {
            // if the element is not in the headers, return nothing.
            if (
              props.newElement &&
              props.newFields.filter((head) => head.text === element.label)
                .length === 0
            ) {
              return null;
            } else if (
              !props.newElement &&
              props.editableFields.filter(
                (head) => head.text === element.label
              ).length === 0
            ) {
              return null;
            }

            // Render the component based on editable and component field.
            if (element.editable === false) {
              return (
                <Row className="element-field" key={`${element.id}-${index}`}>
                  <Col align="start">
                    <div className="element-label">{element.label + ":"}</div>
                    <div className="input-none">
                      {element.value.toString()}
                    </div>
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
                      value={values[index].value.toString()}
                      onChange={(event: any) => {
                        let newValues = [...values];
                        newValues[index].value = event.currentTarget.value;
                        setValues(newValues);
                      }}
                    />
                  </Col>
                </Row>
              );
            } else if (element.component === "password") {
              return (
                <Row className="element-field" key={`${element.id}-${index}`}>
                  <Col align="start">
                    <div className="element-label">{element.label + ":"}</div>
                    <input
                      className="element-editable input-text"
                      type="password"
                      value={values[index].value.toString()}
                      onChange={(event: any) => {
                        let newValues = [...values];
                        newValues[index].value = event.currentTarget.value;
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
                      value={values[index].value.toString()}
                      onChange={(event: any) => {
                        let newValues = [...values];
                        newValues[index].value = event.target.value;
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
                      checked={values[index].value.toString() === "true"}
                      onChange={(event: any) => {
                        let newValues = [...values];
                        newValues[index].value =
                          event.target.checked.toString();
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
                onClick={() => props.onDeleteButtonClicked(values)}
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
                onClick={() => {
                  // Check if any of the fields are type password. If they are,
                  // hash the string and update the value.
                  for (let value of values) {
                    if (value.component === "password") {
                      value.value = hashString(value.value as string);
                    }
                  }
                  props.onSubmitButtonClicked(values);
                }}
              />
            )}
          </Row>
        </>
      )}
    </div>
  );
};
