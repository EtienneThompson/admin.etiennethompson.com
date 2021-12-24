import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { Button } from "../common/Button";
import { AdminTable } from "../common/AdminTable/AdminTable";
import {
  AdminElementEditor,
  EditingComponent,
} from "../common/AdminElementEditor";
import { Row, Col } from "../common/Grid";
import api from "../../api";
import { GetUsersResponse } from "../../types";
import "./UsersEditor.scss";
import { ElementComponent } from "../common/AdminTable";
import { UpdateBody } from "./UserEditor.types";
import { AdminStore } from "../../store/types";
import { setIsLoading } from "../../store/actions";
import { hashString } from "../../utils/hash";

export const UsersEditor = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = React.useState([] as any[]);
  const [editing, setEditing] = React.useState<EditingComponent[] | undefined>(
    undefined
  );
  const [newElement, setNewElement] = React.useState(false);

  const isLoading = useSelector((state: AdminStore) => state.isLoading);

  let headers = ["username", "userid", "clientid"];

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
    console.log(userid);
    api
      .delete("/admin/users/delete", {
        data: { userid: userid },
      })
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  };

  const onSaveButtonClicked = (values: string[]) => {
    let i = 0;
    let updateBody = {} as UpdateBody;
    while (i < headers.length) {
      updateBody[headers[i]] = values[i];
      i++;
    }
    api
      .put("/admin/users/update", { user: updateBody })
      .then((response) => console.log(response))
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
    console.log(values);
    let createBody = {
      username: values[0],
      password: hashString(values[1]),
    };
    api
      .post("/admin/users/create", { newUsers: [createBody] })
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  };

  return (
    <div className="users-editor-container">
      <Row>
        <Col cols="2" align={isLoading ? "center" : "end"}>
          <h1>Users Editor</h1>
        </Col>
        {!isLoading && (
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

/*
export const UsersEditor = () => {
  const [users, setUsers] = React.useState([] as AdminPageUser[]);
  const [newUsers, setNewUsers] = React.useState([] as NewUser[]);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [showError, setShowError] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState(-1);
  const [newUsername, setNewUsername] = React.useState("");

  React.useEffect(() => {
    api
      .get<GetUsersResponse>("/admin/users")
      .then((response) => setUsers(response.data.users))
      .catch((error) => {
        setErrorMessage(error.message);
        setShowError(true);
      });
  }, []);

  const onUsernameEdited = (event: React.FormEvent<HTMLInputElement>) => {
    setNewUsername(event.currentTarget.value);
  };

  const onNewButtonClicked = () => {
    const newUser: NewUser = {
      username: "",
      password: "",
    };
    const addedUsers = newUsers.concat(newUser);
    setNewUsers(addedUsers);
  };

  const onSubmitButtonClicked = () => {
    // Hash every new users password.
    newUsers.map((user) => {
      user.password = hashString(user.password);
      return user;
    });
    api
      .post("/admin/users/create", { newUsers: newUsers })
      .then((response) => {
        console.log("success");
      })
      .catch((error) => {
        console.log("failure");
      });
  };

  const existingUsersTableJSX = React.useMemo(() => {
    const onEditButtonClicked = (index: number, currentUsername: string) => {
      setEditingItem(index);
      setNewUsername(currentUsername);
    };

    const onSaveButtonClicked = (index: number) => {
      users[index].username = newUsername;
      api
        .put("/admin/users/update", { user: users[index] })
        .then((response) => console.log(response))
        .catch((error) => console.log(error));
      setEditingItem(-1);
      setNewUsername("");
    };

    const onDeleteButtonclicked = (index: number) => {
      api
        .delete("/admin/users/delete", {
          data: { userid: users[index].userid },
        })
        .then((response) => console.log(response))
        .catch((error) => console.log(error));
    };

    return (
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Username</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={`existing-user-${index}`}>
              <td style={{ width: "30px" }}>
                {editingItem !== index && (
                  <Button
                    onClick={() => onEditButtonClicked(index, user.username)}
                  >
                    Edit
                  </Button>
                )}
                {editingItem === index && (
                  <Button onClick={() => onSaveButtonClicked(index)}>
                    Save
                  </Button>
                )}
              </td>
              {editingItem !== index && <td>{user.username}</td>}
              {editingItem === index && (
                <td>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={onUsernameEdited}
                  />
                </td>
              )}
              <td style={{ width: "50px" }}>
                <Button onClick={() => onDeleteButtonclicked(index)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }, [users, editingItem, newUsername]);

  const newUsersTableJSX = (
    <table>
      <thead>
        <tr>
          <th>Username</th>
          <th>Password</th>
        </tr>
      </thead>
      <tbody>
        {newUsers.map((user, index) => (
          <tr key={`new-user-${index}`}>
            <td>
              <input
                type="text"
                id={`new-user-${index}-username`}
                onChange={(event: React.FormEvent<HTMLInputElement>) => {
                  newUsers[index].username = event.currentTarget.value;
                }}
              />
            </td>
            <td>
              <input
                type="text"
                id={`new-user-${index}-password`}
                onChange={(event: React.FormEvent<HTMLInputElement>) => {
                  newUsers[index].password = event.currentTarget.value;
                }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="users-editor-container">
      {!showError && (
        <div>
          <Row>
            <h1>User Editor</h1>
          </Row>
          <Row>
            {users.length === 0 && <LoadingSpinner />}
            {users.length !== 0 && existingUsersTableJSX}
          </Row>
          <Row>
            <Button onClick={onNewButtonClicked}>New</Button>
          </Row>
          <Row>{newUsers.length !== 0 && newUsersTableJSX}</Row>
          <Row>
            {newUsers.length !== 0 && (
              <Button onClick={onSubmitButtonClicked}>Submit</Button>
            )}
          </Row>
        </div>
      )}
      {showError && <div>{errorMessage}</div>}
    </div>
  );
};
*/
