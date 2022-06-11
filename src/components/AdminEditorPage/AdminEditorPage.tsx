import React from "react";
import {
  AdminEditorPageProps,
  EditField,
  EditorState,
  Header,
} from "./AdminEditorPage.types";
import "./AdminEditorPage.scss";
import api from "../../api";
import { useParams } from "react-router";
import { AdminNavBar } from "../AdminNavBar/AdminNavBar";
import { GoPlus } from "react-icons/go";
import { Row, Col } from "../common/Grid";
import { AdminButton } from "../../components/common/AdminButton";
import { AdminTable } from "../common/AdminTable";
import {
  AdminElementEditor,
  EditingComponent,
} from "../common/AdminElementEditor";
import { useDispatch, useSelector } from "react-redux";
import { setIsLoading } from "../../store/actions";
import { AdminStore } from "../../store/types";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { Button } from "../common/Button";

export const AdminEdtorPage: React.FunctionComponent<AdminEditorPageProps> = (
  props: AdminEditorPageProps
) => {
  const dispatch = useDispatch();
  const params = useParams();

  document.title = `Etienne Thompson - Admin Center - ${params.elementId}`;
  document.documentElement.className = "theme-light";

  const [elements, setElements] = React.useState([]);
  const [defaultValues, setDefaultValues] = React.useState([]);
  const [editorElement, setEditorElement] = React.useState<EditingComponent[]>(
    []
  );
  const [editorState, setEditorState] = React.useState(EditorState.View);
  const [headers, setHeaders] = React.useState<Header[]>([]);
  const [editableFields, setEditableFields] = React.useState<EditField[]>([]);
  const [newFields, setNewFields] = React.useState<Header[]>([]);

  const isLoading = useSelector((state: AdminStore) => state.isLoading);

  React.useEffect(() => {
    dispatch(setIsLoading(true));
    api
      .get(`/admin/${params.elementId}`)
      .then((response) => {
        console.log(response);
        setElements(response.data.elements);
        setDefaultValues(response.data.defaultValues);
        setHeaders(response.data.headers);
        setEditableFields(response.data.editableFields);
        setNewFields(response.data.newFields);
        dispatch(setIsLoading(false));
      })
      .catch((error) => {
        console.log(error);
        dispatch(setIsLoading(false));
      });
  }, [dispatch, params]);

  const onNewButtonClicked = () => {
    let editingElement: EditingComponent[] = [...defaultValues];
    editingElement.map((elem) => (elem.value = ""));
    setEditorElement(editingElement);
    setEditorState(EditorState.New);
  };

  const onEditButtonClicked = (index: number): void => {
    let editingElement: EditingComponent[] = [...defaultValues];
    headers.map(
      (head) =>
        (editingElement.filter((elem) => elem.id === head.text)[0].value =
          elements[index][head.field])
    );
    setEditorElement(editingElement);
    setEditorState(EditorState.Edit);
    console.log(defaultValues);
  };

  const onBackButtonClicked = () => {
    setEditorState(EditorState.View);
    setEditorElement([]);
  };

  const onDeleteButtonClicked = () => {};

  const onSaveButtonClicked = (values: string[]) => {};

  const onSubmitButtonClicked = (values: string[]) => {};

  return (
    <Row className="admin-editor-container">
      <AdminNavBar />
      <div className="admin-editor-container">
        <Col>
          <Row>
            <Col>
              <h1>{params.elementId} Editor</h1>
            </Col>
            {!isLoading && editorState === EditorState.View && (
              <Col cols="3" align="center">
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
              {!isLoading && editorState === EditorState.View && (
                <AdminTable
                  headers={headers}
                  elements={elements}
                  onEditClick={onEditButtonClicked}
                />
              )}
              {!isLoading && editorState !== EditorState.View && (
                <AdminElementEditor
                  elements={editorElement}
                  newElement={editorState === EditorState.New}
                  editableFields={editableFields}
                  newFields={newFields}
                  onBackButtonClicked={onBackButtonClicked}
                  onDeleteButtonClicked={onDeleteButtonClicked}
                  onSaveButtonClicked={onSaveButtonClicked}
                  onSubmitButtonClicked={onSubmitButtonClicked}
                />
              )}
            </Col>
          </Row>
        </Col>
      </div>
    </Row>
  );
};
