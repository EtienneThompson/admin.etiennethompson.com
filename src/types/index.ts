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

export interface Application {
  applicationid: string;
  applicationname: string;
  redirecturl: string;
}

export interface ApplicationUser {
  userid: string;
  applicationid: string;
  isuser: boolean;
  isadmin: boolean;
}

export interface GetUsersResponse {
  users: AdminPageUser[];
}

export interface GetApplicationsResponse {
  applications: Application[];
}

export interface GetApplicationUsersResponse {
  applicationUsers: ApplicationUser[];
}
