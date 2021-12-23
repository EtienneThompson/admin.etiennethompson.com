import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row } from "../Grid";
import { Button } from "../Button";
import { LoadingSpinner } from "../LoadingSpinner";
import { setIsLoading } from "../../../store/actions";
import {
  AdminElementEditorProps,
  UpdateBody,
} from "./AdminElementEditor.types";
import { AdminStore } from "../../../store/types";
import api from "../../../api";
import "./AdminElementEditor.scss";

export const AdminElementEditor: FunctionComponent<AdminElementEditorProps> = (
  props: AdminElementEditorProps
) => {
  const dispatch = useDispatch();
  const [values, setValues] = React.useState([] as string[]);

  const isLoading = useSelector((state: AdminStore) => state.isLoading);

  React.useEffect(() => {
    dispatch(setIsLoading(true));
    let defaultValues = props.elements.map((element) => {
      return element.value.toString();
    });
    setValues(defaultValues);
    dispatch(setIsLoading(false));
  }, [props, dispatch]);

  const onDeleteButtonClicked = () => {
    let userid = props.elements.filter(
      (element) => element.label === "userid"
    )[0].value;
    // api
    //   .delete("/admin/users/delete", {
    //     data: { userid: userid },
    //   })
    //   .then((response) => console.log(response))
    //   .catch((error) => console.log(error));
  };

  const onSaveButtonClicked = () => {
    console.log(props.elements);
    let updateBody = {} as UpdateBody;
    let i = 0;
    while (i < props.headers.length) {
      updateBody[props.headers[i]] = values[i];
      i++;
    }
    api
      .put("/admin/users/update", { user: updateBody })
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  };

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
                  onChange={() => console.log("change!")}
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
                  onChange={() => console.log("change!")}
                />
              </Row>
            );
          } else {
            return <Row key={`${element.id}-${index}`}>{"what?"}</Row>;
          }
        })}
      <Row>
        <Button onClick={props.onBackButtonClicked}>Back</Button>
        <Button onClick={onDeleteButtonClicked}>Delete</Button>
        <Button onClick={onSaveButtonClicked}>Save</Button>
      </Row>
    </div>
  );
};
