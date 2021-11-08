import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { store } from "../store/store";
import { logout } from "../store/actions";

const instance = axios.create({
  baseURL: `${process.env.REACT_APP_API_ENDPOINT}`,
  timeout: 60000,
});

instance.interceptors.request.use(
  (req: AxiosRequestConfig) => {
    // Set the appid and clientid fields before sending the request.
    if (req.method === "get") {
      if (!req.params) {
        req.params = {};
      }
      req.params.appid = process.env.REACT_APP_APPLICATION_ID;
      req.params.clientid = store.getState().clientId;
    } else {
      let data;
      if (typeof req.data === "string") {
        data = JSON.parse(req.data);
      } else {
        data = req.data;
      }
      data.appid = process.env.REACT_APP_APPLICATION_ID;
      data.clientid = store.getState().clientId;
      req.data = data;
    }
    return req;
  },
  (err) => {
    Promise.reject(err);
  }
);

instance.interceptors.response.use(
  (res: AxiosResponse<any>) => {
    console.log(res);
    return res;
  },
  (err) => {
    console.log("interceptor log");
    console.log(err.response.status);
    console.log(err.response.data.message);
    if (
      err.response.status === 400 &&
      err.response.data.message ===
        "Your session has expired. Please login again."
    ) {
      store.dispatch(logout());
      return (window.location.href = "/login?reason=1");
    }
    return Promise.reject(err);
  }
);

export default instance;
