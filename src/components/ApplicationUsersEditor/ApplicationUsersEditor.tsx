import React from "react";
import {
  AdminPageUser,
  Application,
  ApplicationUser,
  GetUsersResponse,
  GetApplicationsResponse,
  GetApplicationUsersResponse,
} from "../../types";
import { Button } from "../common/Button";
import { Row } from "../common/Grid";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { NewAppUser } from "./ApplicationUsersEditor.types";
import api from "../../api";
import "./ApplicationUsersEditor.scss";

export const ApplicationUsersEditor = () => {
  const [users, setUsers] = React.useState([] as AdminPageUser[]);
  const [apps, setApps] = React.useState([] as Application[]);
  const [appUsers, setAppUsers] = React.useState([] as ApplicationUser[]);
  const [newAppUsers, setNewAppUsers] = React.useState(
    [] as ApplicationUser[]
  );
  const [editingItem, setEditingItem] = React.useState(-1);
  const [isLoading, setIsLoading] = React.useState(false);
  // eslint-disable-next-line
  const [errorMessage, setErrorMessage] = React.useState("");
  // eslint-disable-next-line
  const [showError, setShowError] = React.useState(false);
  const [newIsUser, setNewIsUser] = React.useState(false);
  const [newIsAdmin, setNewIsAdmin] = React.useState(false);

  let retrieveData = React.useCallback(async () => {
    setIsLoading(true);
    let usersResponse = await api.get<GetUsersResponse>("/admin/users");

    let appsResponse = await api.get<GetApplicationsResponse>(
      "/admin/applications"
    );

    let appUsersResponse = await api.get<GetApplicationUsersResponse>(
      "/admin/applicationusers"
    );

    if (appUsersResponse.status !== 200) {
      setErrorMessage("Fetching application users failed.");
      setShowError(true);
    } else if (appsResponse.status !== 200) {
      setErrorMessage("Fetching applications failed");
      setShowError(true);
    } else if (usersResponse.status !== 200) {
      setErrorMessage("Fetching users failed.");
      setShowError(true);
    }
    setUsers(usersResponse.data.users);
    setApps(appsResponse.data.applications);
    setAppUsers(appUsersResponse.data.applicationUsers);
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    retrieveData();
  }, [retrieveData]);

  const onIsUserEdited = (event: React.FormEvent<HTMLInputElement>) => {
    console.log(event.currentTarget.checked);
    setNewIsUser(event.currentTarget.value === "true");
  };

  const onIsAdminEdited = (event: React.FormEvent<HTMLInputElement>) => {
    setNewIsAdmin(event.currentTarget.value === "true");
  };

  const onNewButtonClicked = () => {
    const newAppUser: NewAppUser = {
      userid: "",
      applicationid: "",
      isuser: false,
      isadmin: false,
    };
    const addedAppUsers = newAppUsers.concat(newAppUser);
    setNewAppUsers(addedAppUsers);
  };

  const onSubmitButtonClicked = () => {
    console.log(newAppUsers);
    // api
    //   .post("/admin/applicationusers/create", {
    //     newApplicationUsers: newAppUsers,
    //   })
    //   .then((response) => console.log("success"))
    //   .catch((error) => console.log(error));
  };

  const existingAppUsersTableJSX = React.useMemo(() => {
    const onEditButtonClicked = (
      index: number,
      isuser: boolean,
      isadmin: boolean
    ) => {
      setEditingItem(index);
      setNewIsUser(isuser);
      setNewIsAdmin(isadmin);
    };

    const onSaveButtonClicked = (index: number) => {
      appUsers[index].isuser = newIsUser;
      appUsers[index].isadmin = newIsAdmin;
      api
        .put("/admin/applicationusers/update", {
          applicationuser: appUsers[index],
        })
        .then((response) => console.log(response))
        .catch((error) => console.log(error));
    };

    const onDeleteButtonClicked = (index: number) => {
      api
        .delete("/admin/applicationusers/delete", {
          data: { applicationuser: appUsers[index] },
        })
        .then((response) => console.log(response))
        .catch((error) => console.log(error));
    };

    return (
      <table>
        <thead>
          <tr>
            <th></th>
            <th>User ID</th>
            <th>Application ID</th>
            <th>Is User</th>
            <th>Is Admin</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {appUsers.map((appUser, index) => (
            <tr key={`existing-app-user-${index}`}>
              <td>
                {editingItem !== index && (
                  <Button
                    onClick={() =>
                      onEditButtonClicked(
                        index,
                        appUser.isuser,
                        appUser.isadmin
                      )
                    }
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
              <td>
                {users.filter((e) => e.userid === appUser.userid)[0].username}
              </td>
              <td>
                {
                  apps.filter(
                    (e) => e.applicationid === appUser.applicationid
                  )[0].applicationname
                }
              </td>
              <td>
                {editingItem !== index && appUser.isuser.toString()}
                {editingItem === index && (
                  <input
                    type="checkbox"
                    checked={newIsUser}
                    onChange={onIsUserEdited}
                  />
                )}
              </td>
              <td>
                {editingItem !== index && appUser.isadmin.toString()}
                {editingItem === index && (
                  <input
                    type="checkbox"
                    checked={newIsAdmin}
                    onChange={onIsAdminEdited}
                  />
                )}
              </td>
              <td>
                <Button onClick={() => onDeleteButtonClicked(index)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }, [apps, appUsers, editingItem, newIsAdmin, newIsUser, users]);

  const newAppUsersTableJSX = (
    <table>
      <thead>
        <tr>
          <th>User</th>
          <th>Application</th>
          <th>Is User</th>
          <th>Is Admin</th>
        </tr>
      </thead>
      <tbody>
        {newAppUsers.map((appUser, index) => (
          <tr key={`new-app-user-${index}`}>
            <td>
              <select
                name={`user-${index}`}
                id={`user-${index}`}
                onChange={(event: any) =>
                  (newAppUsers[index].userid = event.target.value)
                }
              >
                {users.map((user, index) => (
                  <option key={`user-option-${index}`} value={user.userid}>
                    {user.username}
                  </option>
                ))}
              </select>
            </td>
            <td>
              <select
                name={`app-${index}`}
                id={`app-${index}`}
                onChange={(event: any) =>
                  (newAppUsers[index].applicationid = event.target.value)
                }
              >
                {apps.map((app, index) => (
                  <option
                    key={`app-option-${index}`}
                    value={app.applicationid}
                  >
                    {app.applicationname}
                  </option>
                ))}
              </select>
            </td>
            <td>
              <input
                type="checkbox"
                onChange={(event: any) => {
                  newAppUsers[index].isuser = event.target.checked;
                }}
              />
            </td>
            <td>
              <input
                type="checkbox"
                onChange={(event: any) => {
                  newAppUsers[index].isadmin = event.target.checked;
                }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="application-users-editor-containter">
      <Row>
        <h1>Application Users Editor</h1>
      </Row>
      {!showError && (
        <div>
          <Row>
            {isLoading && <LoadingSpinner />}
            {!isLoading && existingAppUsersTableJSX}
          </Row>
          <Row>
            <Button onClick={onNewButtonClicked}>New</Button>
          </Row>
          <Row>{newAppUsers.length !== 0 && newAppUsersTableJSX}</Row>
          <Row>
            {newAppUsers.length !== 0 && (
              <Button onClick={onSubmitButtonClicked}>Submit</Button>
            )}
          </Row>
        </div>
      )}
      {showError && (
        <Row>
          <div>{errorMessage}</div>
        </Row>
      )}
    </div>
  );
};
