import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { GoPlus } from "react-icons/go";
import { Row, Col } from "../common/Grid";
import { AdminButton } from "../common/AdminButton";
import { ErrorMessage } from "../common/ErrorMessage";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { AdminTable, ElementComponent } from "../common/AdminTable";
import {
  AdminElementEditor,
  EditingComponent,
} from "../common/AdminElementEditor";
import api from "../../api";
import { GenericStringMap, GetApplicationsResponse } from "../../types";
import { AdminStore } from "../../store/types";
import { setIsLoading } from "../../store/actions";
import "./ApplicationsEditor.scss";

export const ApplicationsEditor = () => {
  const dispatch = useDispatch();
  const [apps, setApps] = React.useState([] as any[]);
  const [editing, setEditing] = React.useState<EditingComponent[] | undefined>(
    undefined
  );
  const [newElement, setNewElement] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const isLoading = useSelector((state: AdminStore) => state.isLoading);

  const headers = ["Application Name", "Application ID", "Redirect URL"];
  const keys = ["applicationname", "applicationid", "redirecturl"];
  const editableFields = ["Application Name", "Redirect URL"];

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
      .catch((error) => {
        setErrorMessage("Failed to fetch application data.");
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
    dispatch(setIsLoading(true));
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
        dispatch(setIsLoading(false));
        onBackButtonClicked();
      })
      .catch((error) => {
        setErrorMessage("Failed to delete the application.");
        dispatch(setIsLoading(false));
      });
  };

  const onSaveButtonClicked = (values: string[]) => {
    dispatch(setIsLoading(true));
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
        dispatch(setIsLoading(false));
        onBackButtonClicked();
      })
      .catch((error) => {
        setErrorMessage("Failed to update the application");
        dispatch(setIsLoading(false));
      });
  };

  const onNewButtonClicked = () => {
    let newAppFields = ["Application Name", "Redirect URL"];
    let editingConfig: EditingComponent[] = newAppFields.map((app, index) => {
      return {
        id: app,
        value: "",
        label: headers[index * 2],
        component: "text",
        editable: true,
      };
    });
    setNewElement(true);
    setEditing(editingConfig);
  };

  const onSubmitButtonClicked = (values: string[]) => {
    dispatch(setIsLoading(true));
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
        dispatch(setIsLoading(false));
        onBackButtonClicked();
      })
      .catch((error) => {
        setErrorMessage("Failed to create the application.");
        dispatch(setIsLoading(false));
      });
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
          {isLoading && <LoadingSpinner />}
          {!isLoading && errorMessage && (
            <ErrorMessage message={errorMessage} />
          )}
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
        </Col>
      </Row>
    </div>
  );
};
