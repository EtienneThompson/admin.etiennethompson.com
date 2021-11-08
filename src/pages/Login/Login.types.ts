import { RouteComponentProps } from "react-router";

export interface LoginProps extends RouteComponentProps {}

export interface LogoutReasons {
  [key: number]: string;
}
