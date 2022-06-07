import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { GoPlus } from "react-icons/go";
import { Row, Col } from "../../components/common/Grid";
import { AdminButton } from "../../components/common/AdminButton";
import { ErrorMessage } from "../../components/common/ErrorMessage";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import {
  AdminTable,
  ElementComponent,
} from "../../components/common/AdminTable";
import {
  AdminElementEditor,
  EditingComponent,
} from "../../components/common/AdminElementEditor";
import api from "../../api";
import { GenericStringMap, GetUsersResponse } from "../../types";
import { AdminStore } from "../../store/types";
import { setIsButtonPressed, setIsLoading } from "../../store/actions";
import { hashString } from "../../utils/hash";
import "./UsersEditor.scss";
import { AdminNavBar } from "../../components/AdminNavBar/AdminNavBar";

export const UsersEditor = () => {
  document.title = "Etienne Thompson - Admin Center - Users";
  document.documentElement.className = "theme-light";

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
    dispatch(setIsButtonPressed(true));
    let userid = editing.filter((element) => element.label === "User ID")[0]
      .value;
    api
      .delete("/admin/users/delete", {
        data: { userid: userid },
      })
      .then((response) => {
        let updatedUsers = users.filter((user) => user.id !== userid);
        setUsers(updatedUsers);
        dispatch(setIsButtonPressed(false));
        onBackButtonClicked();
      })
      .catch((error) => {
        setErrorMessage("Failed to delete the user.");
        dispatch(setIsButtonPressed(false));
      });
  };

  const onSaveButtonClicked = (values: string[]) => {
    dispatch(setIsButtonPressed(true));
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
        dispatch(setIsButtonPressed(false));
        onBackButtonClicked();
      })
      .catch((error) => {
        setErrorMessage("Failed to update the user.");
        dispatch(setIsButtonPressed(false));
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
    dispatch(setIsButtonPressed(true));
    if (values[0].match(/\s/g) != null || values[1].match(/\s/g) != null) {
      dispatch(setIsButtonPressed(false));
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
        dispatch(setIsButtonPressed(false));
        onBackButtonClicked();
      })
      .catch((error) => {
        setErrorMessage("Failed to create the user.");
        dispatch(setIsButtonPressed(false));
      });
  };

  return (
    <Row className="users-editor-container">
      <AdminNavBar />
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
              <AdminButton
                type="icon"
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
    </Row>
  );
};
