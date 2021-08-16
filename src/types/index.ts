export enum LocalStorageKey {
  ClientId = "ClientId",
}

export interface AdminPageUser {
  username: string;
}

export interface GetUsersResponse {
  users: AdminPageUser[];
}
