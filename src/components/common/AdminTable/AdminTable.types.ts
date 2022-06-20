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
  onHeaderClick?: (header: Header, direction: boolean) => void;
  onEditClick: (index: number) => void;
}
