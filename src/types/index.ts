export enum LocalStorageKey {
  ClientId = "ClientId",
  IsUser = "IsUser",
  IsAdmin = "IsAdmin",
}

export interface Header {
  text: string;
  field: string;
}

export interface EditField {
  text: string;
  field: string;
  edit: boolean;
}

export interface GenericStringMap {
  [key: string]: string;
}

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
