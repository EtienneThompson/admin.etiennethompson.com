export interface AdminEditorPageProps {}

export interface Header {
  text: string;
  field: string;
}

export interface EditField {
  text: string;
  field: string;
  edit: boolean;
}

export enum EditorState {
  View = "View",
  New = "New",
  Edit = "Edit",
}
