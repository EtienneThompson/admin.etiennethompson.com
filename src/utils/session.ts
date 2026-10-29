import { LocalStorageKey } from "../types";
import { readFromLocalStorage } from "./localStorage";

// The login.etiennethompson.com page that sends users back here.
export const loginUrl = (): string =>
  `${import.meta.env.VITE_LOGIN_ENDPOINT}/login?appid=${
    import.meta.env.VITE_APPLICATION_ID
  }&redirectBase=${import.meta.env.VITE_LOGIN_REDIRECT}`;

export const redirectToLogin = (): void => {
  window.open(loginUrl(), "_self");
};

// The session saved by a previous login, if it's an admin session.
export const readStoredSession = ():
  | { clientId: string; isUser: boolean; isAdmin: boolean }
  | undefined => {
  const clientId = readFromLocalStorage(LocalStorageKey.ClientId);
  const isUser = readFromLocalStorage(LocalStorageKey.IsUser) === "true";
  const isAdmin = readFromLocalStorage(LocalStorageKey.IsAdmin) === "true";
  if (clientId && isUser && isAdmin) {
    return { clientId, isUser, isAdmin };
  }
  return undefined;
};
