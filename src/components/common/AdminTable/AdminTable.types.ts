interface Header {
  text: string;
  field: string;
}

export interface ElementComponent {
  [key: string]: string;
}

export interface AdminTableProps {
  headers: Header[];
  elements: ElementComponent[];
  onEditClick: (index: number) => void;
}
