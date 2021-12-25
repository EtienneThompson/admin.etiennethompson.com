import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../common/Button";
import { Row, Col } from "../common/Grid";
import { ElementComponent } from "../common/AdminTable";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { AdminTable } from "../common/AdminTable/AdminTable";
import {
  AdminElementEditor,
  EditingComponent,
} from "../common/AdminElementEditor";
import api from "../../api";
import { GetUsersResponse } from "../../types";
import { UpdateBody } from "./UserEditor.types";
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

  const isLoading = useSelector((state: AdminStore) => state.isLoading);

  const headers = ["Username", "User ID", "Client ID"];
  const keys = ["username", "userid", "clientid"];

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
        setUsers(users);
        dispatch(setIsLoading(false));
      })
      .catch((error) => {
        console.log(error);
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
        };
      }
    );
    setNewElement(false);
    setEditing(editingConfig);
  };

  const onBackButtonClicked = () => {
    setNewElement(false);
    setEditing(undefined);
  };

  const onDeleteButtonClicked = () => {
    if (!editing) {
      return;
    }
    let userid = editing.filter((element) => element.label === "userid")[0]
      .value;
    api
      .delete("/admin/users/delete", {
        data: { userid: userid },
      })
      .then((response) => {
        let updatedUsers = users.filter((user) => user.id !== userid);
        setUsers(updatedUsers);
        onBackButtonClicked();
      })
      .catch((error) => console.log(error));
  };

  const onSaveButtonClicked = (values: string[]) => {
    let i = 0;
    let updateBody = {} as UpdateBody;
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
        onBackButtonClicked();
      })
      .catch((error) => console.log(error));
  };

  const onNewButtonClicked = () => {
    let newUserFields = ["username", "password"];
    let editingConfig: EditingComponent[] = newUserFields.map((element) => {
      return {
        id: element,
        value: "",
        label: element,
        component: "text",
      };
    });
    setNewElement(true);
    setEditing(editingConfig);
  };

  const onSubmitButtonClicked = (values: string[]) => {
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
        onBackButtonClicked();
      })
      .catch((error) => console.log(error));
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
            <Button onClick={onNewButtonClicked}>New</Button>
          </Col>
        )}
      </Row>
      <Row>
        {isLoading && <LoadingSpinner />}
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
      </Row>
    </div>
  );
};
