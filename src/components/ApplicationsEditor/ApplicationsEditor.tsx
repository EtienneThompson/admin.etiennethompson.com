import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "../common/Grid";
import { Button } from "../common/Button";
import { GenericStringMap, GetApplicationsResponse } from "../../types";
import api from "../../api";
import "./ApplicationsEditor.scss";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { setIsLoading } from "../../store/actions";
import { AdminStore } from "../../store/types";
import { AdminTable, ElementComponent } from "../common/AdminTable";
import {
  AdminElementEditor,
  EditingComponent,
} from "../common/AdminElementEditor";

export const ApplicationsEditor = () => {
  const dispatch = useDispatch();
  const [apps, setApps] = React.useState([] as any[]);
  const [editing, setEditing] = React.useState<EditingComponent[] | undefined>(
    undefined
  );
  const [newElement, setNewElement] = React.useState(false);

  const isLoading = useSelector((state: AdminStore) => state.isLoading);

  const headers = ["Application Name", "Application ID", "Redirect URL"];
  const keys = ["applicationname", "applicationid", "redirecturl"];

  React.useEffect(() => {
    dispatch(setIsLoading(true));
    api
      .get<GetApplicationsResponse>("/admin/applications")
      .then((response) => {
        let apps = response.data.applications.map((app) => {
          return {
            id: app.applicationid,
            values: [app.applicationname, app.applicationid, app.redirecturl],
          };
        });
        setApps(apps);
        dispatch(setIsLoading(false));
      })
      .catch((error) => console.log(error));
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
    let appid = editing.filter(
      (element) => element.label === "Application ID"
    )[0].value;
    api
      .delete("/admin/applications/delete", {
        data: { application: { applicationid: appid } },
      })
      .then((response) => {
        let updatedApps = apps.filter((app) => app.id !== appid);
        setApps(updatedApps);
        onBackButtonClicked();
      })
      .catch((error) => console.log(error));
  };

  const onSaveButtonClicked = (values: string[]) => {
    let i = 0;
    let updateBody = {} as GenericStringMap;
    while (i < keys.length) {
      updateBody[keys[i]] = values[i];
      i++;
    }
    api
      .put("/admin/applications/update", { application: updateBody })
      .then((response) => {
        let updatedApp = apps.filter((app) => app.id === values[1])[0];
        updatedApp.values[0] = values[0];
        updatedApp.values[2] = values[2];
        setApps(apps);
        onBackButtonClicked();
      });
  };

  const onNewButtonClicked = () => {
    let newAppFields = ["applicationname", "redirecturl"];
    let editingConfig: EditingComponent[] = newAppFields.map((app, index) => {
      return {
        id: app,
        value: "",
        label: headers[index * 2],
        component: "text",
      };
    });
    setNewElement(true);
    setEditing(editingConfig);
  };

  const onSubmitButtonClicked = (values: string[]) => {
    console.log(values);
    let createBody = {
      applicationname: values[0],
      redirecturl: values[1],
    };
    api
      .post("/admin/applications/create", { newApplication: createBody })
      .then((response) => {
        let newApps = [...apps];
        let createdApp = response.data.createdApplication;
        newApps.push({
          id: createdApp.applicationid,
          values: [
            createdApp.applicationname,
            createdApp.applicationid,
            createdApp.redirecturl,
          ],
        });
        setApps(newApps);
        onBackButtonClicked();
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="applications-editor-container">
      <Row>
        <Col
          cols="2"
          align={isLoading ? "center" : editing ? "center" : "end"}
        >
          <h1>Applications Editor</h1>
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
            elements={apps}
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

export const ApplicationsEditor: React.FunctionComponent<ApplicationsEditorProps> =
  (props: ApplicationsEditorProps) => {
    const [applications, setApplications] = React.useState(
      [] as Application[]
    );
    const [newApplications, setNewApplications] = React.useState(
      [] as Application[]
    );
    const [errorMessage, setErrorMessage] = React.useState("");
    const [showError, setShowError] = React.useState(false);
    const [editingItem, setEditingItem] = React.useState(-1);
    const [newApplicationName, setNewApplicationName] = React.useState("");
    const [newRedirectUrl, setNewRedirectUrl] = React.useState("");

    React.useEffect(() => {
      api
        .get<GetApplicationsResponse>("/admin/applications")
        .then((response) => {
          console.log("success");
          setApplications(response.data.applications);
        })
        .catch((error) => {
          setErrorMessage(error.message);
          setShowError(true);
        });
    }, []);

    const onApplicationNameEdited = (
      event: React.FormEvent<HTMLInputElement>
    ) => {
      setNewApplicationName(event.currentTarget.value);
    };

    const onRedirectUrlEdited = (event: React.FormEvent<HTMLInputElement>) => {
      setNewRedirectUrl(event.currentTarget.value);
    };

    const onNewButtonClicked = () => {
      const newApplication: Application = {
        applicationid: "",
        applicationname: "",
        redirecturl: "",
      };
      const addedUsers = newApplications.concat(newApplication);
      setNewApplications(addedUsers);
    };

    const onSubmitButtonClicked = () => {
      api
        .post("/admin/applications/create", {
          newApplications: newApplications,
        })
        .then((response) => console.log("success"))
        .catch((error) => console.log("failure"));
    };

    const existingApplicationsTableJSX = React.useMemo(() => {
      const onEditButtonClicked = (
        index: number,
        currentName: string,
        currentUrl: string
      ) => {
        setEditingItem(index);
        setNewApplicationName(currentName);
        setNewRedirectUrl(currentUrl);
      };

      const onSaveButtonClicked = (index: number) => {
        applications[index].applicationname = newApplicationName;
        applications[index].redirecturl = newRedirectUrl;
        api
          .put("/admin/applications/update", {
            application: applications[index],
          })
          .then((response) => console.log(response))
          .catch((error) => console.log(error));
      };

      const onDeleteButtonClicked = (index: number) => {
        api
          .delete("/admin/applications/delete", {
            data: { application: applications[index] },
          })
          .then((response) => console.log(response))
          .catch((error) => console.log(error));
      };

      return (
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Application Name</th>
              <th>Redirect URL</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application, index) => {
              return (
                <tr key={`existing-application-${index}`}>
                  <td>
                    {editingItem !== index && (
                      <Button
                        onClick={() =>
                          onEditButtonClicked(
                            index,
                            applications[index].applicationname,
                            applications[index].redirecturl
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
                    {editingItem !== index && application.applicationname}
                    {editingItem === index && (
                      <input
                        type="text"
                        value={newApplicationName}
                        onChange={onApplicationNameEdited}
                      />
                    )}
                  </td>
                  <td>
                    {editingItem !== index && application.redirecturl}
                    {editingItem === index && (
                      <input
                        type="text"
                        value={newRedirectUrl}
                        onChange={onRedirectUrlEdited}
                      />
                    )}
                  </td>
                  <td>
                    <Button onClick={() => onDeleteButtonClicked(index)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    }, [applications, editingItem, newApplicationName, newRedirectUrl]);

    const newApplicationsTableJSX = (
      <table>
        <thead>
          <tr>
            <th>Application Name</th>
            <th>Redirect URL</th>
          </tr>
        </thead>
        <tbody>
          {newApplications.map((application, index) => (
            <tr key={`new-application-${index}`}>
              <td>
                <input
                  type="text"
                  id={`new-application-${index}-name`}
                  onChange={(event: React.FormEvent<HTMLInputElement>) => {
                    newApplications[index].applicationname =
                      event.currentTarget.value;
                  }}
                />
              </td>
              <td>
                <input
                  type="text"
                  id={`new-application-${index}-redirecturl`}
                  onChange={(event: React.FormEvent<HTMLInputElement>) => {
                    newApplications[index].redirecturl =
                      event.currentTarget.value;
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );

    return (
      <div className="applications-editor-container">
        {!showError && (
          <div>
            <Row>
              <h1>Applications Editor</h1>
            </Row>
            <Row>
              {applications.length === 0 && <LoadingSpinner />}
              {applications.length !== 0 && existingApplicationsTableJSX}
            </Row>
            <Row>
              <Button onClick={onNewButtonClicked}>New</Button>
            </Row>
            <Row>
              {newApplications.length !== 0 && newApplicationsTableJSX}
            </Row>
            <Row>
              {newApplications.length !== 0 && (
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
