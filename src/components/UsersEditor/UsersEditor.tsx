import React from "react";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { Row } from "../common/Grid";
import { Button } from "../common/Button";
import api from "../../api";
import { GetUsersResponse, AdminPageUser } from "../../types";
import { NewUser } from "./UserEditor.types";
import "./UsersEditor.scss";

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
    console.log("new button clicked");
    const newUser: NewUser = {
      username: "",
      password: "",
    };
    const addedUsers = newUsers.concat(newUser);
    setNewUsers(addedUsers);
  };

  const onSubmitButtonClicked = () => {
    console.log("submit button clicked");
    api
      .post("/admin/users/create", newUsers)
      .then((response) => {
        console.log("success");
      })
      .catch((error) => {
        console.log("failure");
      });
  };

  const existingUsersTableJSX = React.useMemo(() => {
    const onEditButtonClicked = (index: number, currentUsername: string) => {
      console.log("edit button clicked");
      setEditingItem(index);
      setNewUsername(currentUsername);
    };

    const onSaveButtonClicked = (index: number) => {
      users[index].username = newUsername;
      setEditingItem(-1);
      setNewUsername("");
    };

    return (
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Username</th>
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
