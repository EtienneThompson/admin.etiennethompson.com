export enum LocalStorageKey {
  ClientId = "ClientId",
  IsUser = "IsUser",
  IsAdmin = "IsAdmin",
}

export interface AdminPageUser {
  userid: string;
  username: string;
  password: string;
  clientid: string;
}

export interface GetUsersResponse {
  users: AdminPageUser[];
}
