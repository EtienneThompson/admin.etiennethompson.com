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
  options?: OptionConfiguration[];
  onChange: (event: any) => void;
}

export interface AdminElementEditorProps {
  elements: EditingComponent[];
  onBackButtonClicked: () => void;
}
