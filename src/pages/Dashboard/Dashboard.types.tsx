export interface DashboardProps {}

export interface TableCounts {
  name: string;
  count: number;
}

export interface CountData {
  total: number;
  tables: TableCounts[];
}
