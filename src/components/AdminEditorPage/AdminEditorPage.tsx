import React from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { GoPlus } from "react-icons/go";
import { Row, Col } from "../common/Grid";
import { AdminTable } from "../common/AdminTable";
import { AdminNavBar } from "../AdminNavBar/AdminNavBar";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { AdminButton } from "../../components/common/AdminButton";
import { AdminElementEditor } from "../common/AdminElementEditor";
import { setIsButtonPressed, setIsLoading } from "../../store/actions";
import { AdminStore } from "../../store/types";
import { EditingComponent, EditField, Header } from "../../types";
import { AdminEditorPageProps, EditorState } from "./AdminEditorPage.types";
import api from "../../api";
import "./AdminEditorPage.scss";

export const AdminEdtorPage: React.FunctionComponent<AdminEditorPageProps> = (
  props: AdminEditorPageProps
) => {
  const dispatch = useDispatch();
  const params = useParams();

  document.title = `Etienne Thompson - Admin Center - ${params.elementId}`;
  document.documentElement.className = "theme-light";

  const [elements, setElements] = React.useState([]);
  const [defaultValues, setDefaultValues] = React.useState<EditingComponent[]>(
    []
  );
  const [editorElement, setEditorElement] = React.useState<EditingComponent[]>(
    []
  );
  const [editingIndex, setEditingIndex] = React.useState(-1);
  const [editorState, setEditorState] = React.useState(EditorState.View);
  const [headers, setHeaders] = React.useState<Header[]>([]);
  const [editableFields, setEditableFields] = React.useState<EditField[]>([]);
  const [newFields, setNewFields] = React.useState<Header[]>([]);

  const isLoading = useSelector((state: AdminStore) => state.isLoading);

  React.useEffect(() => {
    // Get the response data based on common data schema from the API endpoint
    // defined by the current path.
    dispatch(setIsLoading(true));
    api
      .get(`/admin/${params.elementId}`)
      .then((response) => {
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
    // Grab the default values and use it for the editor element.
    let editingElement: EditingComponent[] = [...defaultValues];
    editingElement.map((elem) => (elem.value = ""));
    setEditorElement(editingElement);
    setEditorState(EditorState.New);
  };

  const onEditButtonClicked = (index: number): void => {
    // Use the default values as a framework and update the values with the
    // clicked elements' values.
    let editingElement: EditingComponent[] = [...defaultValues];
    headers.map(
      (head) =>
        (editingElement.filter((elem) => elem.id === head.field)[0].value =
          elements[index][head.field])
    );
    setEditingIndex(index);
    setEditorElement(editingElement);
    setEditorState(EditorState.Edit);
  };

  const onBackButtonClicked = () => {
    // Update state so it isn't displaying the editor.
    setEditingIndex(-1);
    setEditorState(EditorState.View);
    setEditorElement([]);
  };

  const onDeleteButtonClicked = (values: EditingComponent[]) => {
    // Send the values of the editing element and delete it.
    dispatch(setIsButtonPressed(true));
    api
      .delete(`/admin/${params.elementId}/delete`, {
        data: { deleteElement: values },
      })
      .then((response) => {
        elements.splice(editingIndex, 1);
        setElements(elements);
        onBackButtonClicked();
        dispatch(setIsButtonPressed(false));
      })
      .catch((error) => {
        console.log(error);
        dispatch(setIsButtonPressed(false));
      });
  };

  const onSaveButtonClicked = (values: EditingComponent[]) => {
    // Send the values of the editing elment and update it.
    dispatch(setIsButtonPressed(true));
    api
      .put(`/admin/${params.elementId}/update`, {
        updateElement: values,
      })
      .then((response) => {
        elements[editingIndex] = response.data.updatedElement as never;
        setElements(elements);
        dispatch(setIsButtonPressed(false));
        onBackButtonClicked();
      })
      .catch((error) => {
        console.log(error);
        dispatch(setIsButtonPressed(false));
      });
  };

  const onSubmitButtonClicked = (values: EditingComponent[]) => {
    // Send the values of the editing element and add it.
    dispatch(setIsButtonPressed(true));
    api
      .post(`/admin/${params.elementId}/create`, {
        newElement: values,
      })
      .then((response) => {
        elements.push(response.data.newElement as never);
        setElements(elements);
        dispatch(setIsButtonPressed(false));
        onBackButtonClicked();
      })
      .catch((error) => {
        console.log(error);
        dispatch(setIsButtonPressed(false));
      });
  };

  const onHeaderClicked = (header: Header, dir: boolean) => {
    // Sort the database entries based on the given header.
    let sortedElements = [...elements];
    if (dir) {
      sortedElements.sort((a: any, b: any) =>
        a[header.field] >= b[header.field] ? 1 : -1
      );
    } else {
      sortedElements.sort((a: any, b: any) =>
        a[header.field] < b[header.field] ? 1 : -1
      );
    }
    setElements(sortedElements);
  };

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
                  onHeaderClick={onHeaderClicked}
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
