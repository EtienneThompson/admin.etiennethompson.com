export interface OptionConfiguration {
  id: string;
  value: string;
  text: string;
}

export interface EditingComponent {
  id: string;
  value: string | boolean;
  label: string;
  component: "text" | "select" | "checkbox";
  editable: boolean;
  options?: OptionConfiguration[];
}

export interface AdminElementEditorProps {
  elements: EditingComponent[];
  newElement: boolean;
  onBackButtonClicked: () => void;
  onDeleteButtonClicked: () => void;
  onSaveButtonClicked: (values: string[]) => void;
  onSubmitButtonClicked: (values: string[]) => void;
}
