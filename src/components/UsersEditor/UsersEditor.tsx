import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { GoPlus } from "react-icons/go";
import { Row, Col } from "../common/Grid";
import { IconButton } from "../common/IconButton";
import { ErrorMessage } from "../common/ErrorMessage";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { AdminTable, ElementComponent } from "../common/AdminTable";
import {
  AdminElementEditor,
  EditingComponent,
} from "../common/AdminElementEditor";
import api from "../../api";
import { GenericStringMap, GetUsersResponse } from "../../types";
import { AdminStore } from "../../store/types";
import { setIsLoading } from "../../store/actions";
import { hashString } from "../../utils/hash";
import "./UsersEditor.scss";

export const UsersEditor = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = React.useState([] as any[]);
  const [editing, setEditing] = React.useState<EditingComponent[] | undefined>(
    undefined
  );
  const [newElement, setNewElement] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const isLoading = useSelector((state: AdminStore) => state.isLoading);

  const headers = ["Username", "User ID", "Client ID"];
  const keys = ["username", "userid", "clientid"];
  const editableFields = ["Username"];

  React.useEffect(() => {
    dispatch(setIsLoading(true));
    api
      .get<GetUsersResponse>("/admin/users")
      .then((response) => {
        let users = response.data.users.map((user) => {
          return {
            id: user.userid,
            values: [user.username, user.userid, user.clientid],
          };
        });
        setErrorMessage("");
        setUsers(users);
        dispatch(setIsLoading(false));
      })
      .catch((error) => {
        setErrorMessage("Failed to fetch user data.");
        dispatch(setIsLoading(false));
      });
  }, [dispatch]);

  const onEditClick = (element: ElementComponent) => {
    let editingConfig: EditingComponent[] = element.values.map(
      (value, index) => {
        return {
          id: value,
          value: value,
          label: headers[index],
          component: "text",
          editable: editableFields.includes(headers[index]),
        };
      }
    );
    setNewElement(false);
    setEditing(editingConfig);
  };

  const onBackButtonClicked = () => {
    setErrorMessage("");
    setNewElement(false);
    setEditing(undefined);
  };

  const onDeleteButtonClicked = () => {
    if (!editing) {
      return;
    }
    dispatch(setIsLoading(true));
    let userid = editing.filter((element) => element.label === "User ID")[0]
      .value;
    api
      .delete("/admin/users/delete", {
        data: { userid: userid },
      })
      .then((response) => {
        let updatedUsers = users.filter((user) => user.id !== userid);
        setUsers(updatedUsers);
        dispatch(setIsLoading(false));
        onBackButtonClicked();
      })
      .catch((error) => {
        setErrorMessage("Failed to delete the user.");
        dispatch(setIsLoading(false));
      });
  };

  const onSaveButtonClicked = (values: string[]) => {
    dispatch(setIsLoading(true));
    let i = 0;
    let updateBody = {} as GenericStringMap;
    while (i < keys.length) {
      updateBody[keys[i]] = values[i];
      i++;
    }
    api
      .put("/admin/users/update", { user: updateBody })
      .then((response) => {
        let updatedUser = users.filter((user) => user.id === values[1])[0];
        updatedUser.values[0] = values[0];
        // The array is being modified itself, so we just set it to itself again.
        setUsers(users);
        dispatch(setIsLoading(false));
        onBackButtonClicked();
      })
      .catch((error) => {
        setErrorMessage("Failed to update the user.");
        dispatch(setIsLoading(false));
      });
  };

  const onNewButtonClicked = () => {
    let newUserFields = ["Username", "Password"];
    let editingConfig: EditingComponent[] = newUserFields.map((element) => {
      return {
        id: element,
        value: "",
        label: element,
        component: "text",
        editable: true,
      };
    });
    setNewElement(true);
    setEditing(editingConfig);
  };

  const onSubmitButtonClicked = (values: string[]) => {
    dispatch(setIsLoading(true));
    if (values[0].match(/\s/g) != null || values[1].match(/\s/g) != null) {
      dispatch(setIsLoading(false));
      setErrorMessage(
        "Invalid character in username or password. Cannot contain whitespace."
      );
      return;
    }
    let createBody = {
      username: values[0],
      password: hashString(values[1]),
    };
    api
      .post("/admin/users/create", { newUser: createBody })
      .then((response) => {
        let newUsers = [...users];
        let createdUser = response.data.createdUser;
        newUsers.push({
          id: createdUser.userid,
          values: [
            createdUser.username,
            createdUser.userid,
            createdUser.clientid,
          ],
        });
        setUsers(newUsers);
        dispatch(setIsLoading(false));
        onBackButtonClicked();
      })
      .catch((error) => {
        setErrorMessage("Failed to create the user.");
        dispatch(setIsLoading(false));
      });
  };

  return (
    <div className="users-editor-container">
      <Row>
        <Col
          cols="2"
          align={isLoading ? "center" : editing ? "center" : "end"}
        >
          <h1>Users Editor</h1>
        </Col>
        {!isLoading && !editing && (
          <Col cols="3" align="end">
            <IconButton
              icon={<GoPlus />}
              text="New"
              onClick={onNewButtonClicked}
            />
          </Col>
        )}
      </Row>
      <Row>
        <Col>
          {isLoading && !errorMessage && <LoadingSpinner />}
          {!isLoading && errorMessage && (
            <ErrorMessage message={errorMessage} />
          )}
          {!isLoading && !editing && (
            <AdminTable
              headers={headers}
              elements={users}
              onEditClick={onEditClick}
            />
          )}
          {!isLoading && editing && (
            <AdminElementEditor
              elements={editing}
              newElement={newElement}
              onBackButtonClicked={onBackButtonClicked}
              onDeleteButtonClicked={onDeleteButtonClicked}
              onSaveButtonClicked={onSaveButtonClicked}
              onSubmitButtonClicked={onSubmitButtonClicked}
            />
          )}
        </Col>
      </Row>
    </div>
  );
};
