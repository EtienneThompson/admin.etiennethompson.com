import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  GetUsersResponse,
  GetApplicationsResponse,
  GetApplicationUsersResponse,
} from "../../types";
import { Button } from "../common/Button";
import { Row, Col } from "../common/Grid";
import { LoadingSpinner } from "../common/LoadingSpinner";
import api from "../../api";
import "./ApplicationUsersEditor.scss";
import { AdminStore } from "../../store/types";
import { setIsLoading } from "../../store/actions";
import { AdminTable, ElementComponent } from "../common/AdminTable";
import {
  AdminElementEditor,
  EditingComponent,
} from "../common/AdminElementEditor";

export const ApplicationUsersEditor = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = React.useState([] as any[]);
  const [apps, setApps] = React.useState([] as any[]);
  const [appUsers, setAppUsers] = React.useState([] as any[]);
  const [editing, setEditing] = React.useState<EditingComponent[] | undefined>(
    undefined
  );
  const [newElement, setNewElement] = React.useState(false);

  const isLoading = useSelector((state: AdminStore) => state.isLoading);

  const headers = ["Username", "Application", "User Status", "Admin Status"];

  React.useEffect(() => {
    let fetchData = async () => {
      dispatch(setIsLoading(true));
      let usersRequest = api.get<GetUsersResponse>("/admin/users");
      let appsRequest = api.get<GetApplicationsResponse>(
        "/admin/applications"
      );
      let appUsersRequest = api.get<GetApplicationUsersResponse>(
        "/admin/applicationusers"
      );

      let usersResponse = await usersRequest;
      let appsResponse = await appsRequest;
      let appUsersResponse = await appUsersRequest;

      let usersData = [] as any[];
      let appsData = [] as any[];
      if (usersResponse.status === 200) {
        usersData = usersResponse.data.users;
        setUsers(usersResponse.data.users);
      } else {
        console.log("Failed to fetch users");
      }

      if (appsResponse.status === 200) {
        appsData = appsResponse.data.applications;
        setApps(appsResponse.data.applications);
      } else {
        console.log("Failed to fetch apps");
      }

      if (appUsersResponse.status === 200) {
        // setAppUsers(appUsersResponse.data.applicationUsers);
        let data = appUsersResponse.data.applicationUsers.map((appUser) => {
          return {
            id: `${appUser.userid}-${appUser.applicationid}`,
            values: [
              usersData.filter((user) => user.userid === appUser.userid)[0]
                .username,
              appsData.filter(
                (app) => app.applicationid === appUser.applicationid
              )[0].applicationname,
              appUser.isuser,
              appUser.isadmin,
            ],
          };
        });
        setAppUsers(data);
      } else {
        console.log("Failed to fetch application users");
      }
      dispatch(setIsLoading(false));
    };
    fetchData();
  }, [dispatch]);

  const onEditClick = (element: ElementComponent) => {
    let editingConfig: EditingComponent[] = element.values.map(
      (value, index) => {
        return {
          id: `${value.toString()}-${index}`,
          value: value,
          label: headers[index],
          component: headers[index].includes("Status") ? "checkbox" : "select",
        };
      }
    );
    editingConfig[0].options = users.map((user) => {
      return {
        id: user.userid,
        value: user.userid,
        text: user.username,
      };
    });
    editingConfig[1].options = apps.map((app) => {
      return {
        id: app.applicationid,
        value: app.applicationid,
        text: app.applicationname,
      };
    });
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
    dispatch(setIsLoading(true));
    let username = editing.filter((element) => element.label === "Username")[0]
      .value;
    let appname = editing.filter(
      (element) => element.label === "Application"
    )[0].value;
    let userid = users.filter((user) => user.username === username)[0].userid;
    let appid = apps.filter((app) => app.applicationname === appname)[0]
      .applicationid;

    api
      .delete("/admin/applicationusers/delete", {
        data: { applicationuser: { userid: userid, applicationid: appid } },
      })
      .then((response) => {
        let updatedAppUsers = appUsers.filter(
          (appUser) =>
            appUser.values[0] !== username || appUser.values[1] !== appname
        );
        setAppUsers(updatedAppUsers);
        dispatch(setIsLoading(false));
        onBackButtonClicked();
      })
      .catch((error) => {
        console.log(error);
        dispatch(setIsLoading(false));
      });
  };

  const onSaveButtonClicked = (values: string[]) => {
    dispatch(setIsLoading(true));
    let [username, appname, isuser, isadmin] = values;
    let userid = users.filter((user) => user.username === username)[0].userid;
    let appid = apps.filter((app) => app.applicationname === appname)[0]
      .applicationid;
    let updateBody = {
      userid: userid,
      applicationid: appid,
      isuser: isuser === "true",
      isadmin: isadmin === "true",
    };
    api
      .put("/admin/applicationusers/update", {
        applicationuser: updateBody,
      })
      .then((response) => {
        let updatedAppUser = appUsers.filter(
          (appUser) =>
            appUser.values[0] === username && appUser.values[1] === appname
        )[0];
        updatedAppUser.values[2] = isuser;
        updatedAppUser.values[3] = isadmin;
        setAppUsers(appUsers);
        dispatch(setIsLoading(false));
        onBackButtonClicked();
      })
      .catch((error) => {
        console.log(error);
        dispatch(setIsLoading(false));
      });
  };

  const onNewButtonClicked = () => {
    let defaultValues = ["---", "---", "false", "false"];
    let editingConfig: EditingComponent[] = headers.map((header, index) => {
      return {
        id: header,
        value: defaultValues[index],
        label: header,
        component: header.includes("Status") ? "checkbox" : "select",
      };
    });
    editingConfig[0].options = users.map((user) => {
      return {
        id: user.userid,
        value: user.userid,
        text: user.username,
      };
    });
    editingConfig[1].options = apps.map((app) => {
      return {
        id: app.applicationid,
        value: app.applicationid,
        text: app.applicationname,
      };
    });
    setNewElement(true);
    setEditing(editingConfig);
  };

  const onSubmitButtonClicked = (values: string[]) => {
    dispatch(setIsLoading(true));
    let createBody = {
      userid: values[0],
      applicationid: values[1],
      isuser: values[2] === "true",
      isadmin: values[3] === "true",
    };
    api
      .post("/admin/applicationusers/create", {
        newApplicationUser: createBody,
      })
      .then((response) => {
        let newAppUsers = [...appUsers];
        console.log(response.data);
        let createdAppUser = response.data.createdApplicationUser;
        newAppUsers.push({
          id: createdAppUser.userid,
          values: [
            users.filter((user) => user.userid === createdAppUser.userid)[0]
              .username,
            apps.filter(
              (app) => app.applicationid === createdAppUser.applicationid
            )[0].applicationname,
            createdAppUser.isuser,
            createdAppUser.isadmin,
          ],
        });
        setAppUsers(newAppUsers);
        dispatch(setIsLoading(false));
        onBackButtonClicked();
      })
      .catch((error) => {
        console.log(error);
        dispatch(setIsLoading(false));
      });
  };

  return (
    <div className="application-users-editor-container">
      <Row>
        <Col align={isLoading ? "center" : editing ? "center" : "end"}>
          <h1>Application Users Editor</h1>
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
            elements={appUsers}
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
