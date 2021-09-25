import React from "react";
import { Row } from "../common/Grid";
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

    React.useEffect(() => {
      api
        .get<GetApplicationsResponse>("/admin/applications")
        .then((response) => {
          console.log("success");
          setApplications(response.data.applications);
        })
        .catch((error) => {
          console.log(error);
        });
    });

    const existingApplicationsTableJSX = React.useMemo(() => {
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
                  <td></td>
                  <td>{application.applicationname}</td>
                  <td>{application.redirecturl}</td>
                  <td></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    }, [applications]);

    return (
      <div className="applications-editor-container">
        <div>
          <Row>
            <h1>Applications Editor</h1>
          </Row>
          <Row>
            {applications.length === 0 && <LoadingSpinner />}
            {applications.length !== 0 && existingApplicationsTableJSX}
          </Row>
        </div>
      </div>
    );
  };
