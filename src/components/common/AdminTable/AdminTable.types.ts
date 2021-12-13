export interface ElementComponents {
  id: string;
  values: string[];
}

export interface AdminTableProps {
  headers: string[];
  elements: ElementComponents[];
  onEditClick: (element: any) => void;
}
