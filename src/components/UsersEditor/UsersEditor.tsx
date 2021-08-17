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
        setErrorMessage(error.data.message);
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
  };

  const existingUsersTableJSX = React.useMemo(() => {
    const onEditButtonClicked = (index: number, currentUsername: string) => {
      console.log("edit button clicked");
      console.log(index);
      setEditingItem(index);
      setNewUsername(currentUsername);
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
                <Button
                  onClick={() => onEditButtonClicked(index, user.username)}
                >
                  Edit
                </Button>
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
                placeholder="username"
              />
            </td>
            <td>
              <input
                type="text"
                id={`new-user-${index}-password`}
                placeholder="password"
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
          {newUsers.length !== 0 && newUsersTableJSX}
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
