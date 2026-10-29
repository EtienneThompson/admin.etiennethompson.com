import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { store } from "../store/store";
import { logout } from "../store/actions";

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_API_ENDPOINT}`,
  timeout: 60000,
});

instance.interceptors.request.use(
  (req: AxiosRequestConfig) => {
    // Set the appid and clientid fields before sending the request.
    if (req.method === "get") {
      if (!req.params) {
        req.params = {};
      }
      req.params.appid = import.meta.env.VITE_APPLICATION_ID;
      req.params.clientid = store.getState().clientId;
    } else {
      let data;
      if (typeof req.data === "string") {
        data = JSON.parse(req.data);
      } else {
        data = req.data;
      }
      data.appid = import.meta.env.VITE_APPLICATION_ID;
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
    return res;
  },
  (err) => {
    if (
      err.response?.status === 400 &&
      err.response?.data?.message ===
        "Your session has expired. Please login again."
    ) {
      store.dispatch(logout());
      return (window.location.href = "/logout?reason=1");
    }
    return Promise.reject(err);
  }
);

// A message to show the user when a request fails.
export const errorMessage = (error: any, fallback: string): string => {
  const message = error?.response?.data?.message;
  if (typeof message === "string" && message) {
    return message;
  }
  if (error?.response === undefined) {
    return "Couldn't reach the server. Check your connection and try again.";
  }
  return fallback;
};

export default instance;
