export interface ElementComponent {
  id: string;
  values: string[];
}

export interface AdminTableProps {
  headers: string[];
  elements: ElementComponent[];
  onEditClick: (element: any) => void;
}
