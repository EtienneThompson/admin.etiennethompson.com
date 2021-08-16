import React from "react";
import queryString from "query-string";
import { useDispatch } from "react-redux";
import { updateClientId } from "../../store/actions";
import { Toolbar } from "../../components/common/Toolbar";
import { LoginProps } from "./Login.types";
import "./Login.scss";

export const Login: React.FunctionComponent<LoginProps> = (
  props: LoginProps
) => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    let params = queryString.parse(window.location.search.substring(1));
    let clientId = params.clientId
      ? Array.isArray(params.clientId)
        ? params.clientId[0]
        : params.clientId
      : "";
    dispatch(updateClientId(clientId));
    props.history.push("/dashboard");
  }, [dispatch, props.history]);

  return (
    <div>
      <Toolbar />
    </div>
  );
};
