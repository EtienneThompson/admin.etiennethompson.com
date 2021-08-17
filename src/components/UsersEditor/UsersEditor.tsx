import React from "react";
import { LoadingSpinner } from "../common/LoadingSpinner";
import api from "../../api";
import { GetUsersResponse, AdminPageUser } from "../../types";
import "./UsersEditor.scss";

export const UsersEditor = () => {
  const [users, setUsers] = React.useState([] as AdminPageUser[]);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [showError, setShowError] = React.useState(false);

  React.useEffect(() => {
    api
      .get<GetUsersResponse>("/admin/users")
      .then((response) => setUsers(response.data.users))
      .catch((error) => {
        setErrorMessage(error.data.message);
        setShowError(true);
      });
  }, []);

  return (
    <div className="users-editor-container">
      {!showError && (
        <div>
          <div>User Editor</div>
          {users.length === 0 && <LoadingSpinner />}
          {users &&
            users.map((user, index) => <div key={index}>{user.username}</div>)}
        </div>
      )}
      {showError && <div>{errorMessage}</div>}
    </div>
  );
};
