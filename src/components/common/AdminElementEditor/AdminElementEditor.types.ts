import { EditingComponent, EditField, Header } from "../../../types";

export interface AdminElementEditorProps {
  elements: EditingComponent[];
  newElement: boolean;
  editableFields: EditField[];
  newFields: Header[];
  onBackButtonClicked: () => void;
  onDeleteButtonClicked: (values: EditingComponent[]) => void;
  onSaveButtonClicked: (values: EditingComponent[]) => void;
  onSubmitButtonClicked: (values: EditingComponent[]) => void;
}
