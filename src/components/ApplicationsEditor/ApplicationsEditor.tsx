import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "../common/Grid";
import { Button } from "../common/Button";
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
