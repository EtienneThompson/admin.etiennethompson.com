export interface NewUser {
  username: string;
  password: string;
}

export interface CreateUsersRequest {
  newUsers: NewUser[];
}
