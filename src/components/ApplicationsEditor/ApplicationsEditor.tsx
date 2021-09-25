import React from "react";
import { Row } from "../common/Grid";
import { Button } from "../common/Button";
import { Application, GetApplicationsResponse } from "../../types";
import api from "../../api";
import { ApplicationsEditorProps } from "./ApplicationsEditor.types";
import "./ApplicationsEditor.scss";
import { LoadingSpinner } from "../common/LoadingSpinner";

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
