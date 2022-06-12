import { EditField, Header } from "../../AdminEditorPage";

export interface OptionConfiguration {
  id: string;
  value: string;
  text: string;
}

export interface EditingComponent {
  id: string;
  value: string | boolean;
  label: string;
  component: "text" | "password" | "select" | "checkbox";
  editable: boolean;
  options?: OptionConfiguration[];
}

export interface AdminElementEditorProps {
  elements: EditingComponent[];
  newElement: boolean;
  editableFields: EditField[];
  newFields: Header[];
  onBackButtonClicked: () => void;
  onDeleteButtonClicked: () => void;
  onSaveButtonClicked: (values: EditingComponent[]) => void;
  onSubmitButtonClicked: (values: EditingComponent[]) => void;
}
