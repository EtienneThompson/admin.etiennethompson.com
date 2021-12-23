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
}

export interface AdminElementEditorProps {
  elements: EditingComponent[];
  headers: string[];
  onBackButtonClicked: () => void;
}

export interface UpdateBody {
  [key: string]: string | boolean;
}
