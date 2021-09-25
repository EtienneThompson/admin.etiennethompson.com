import { LocalStorageKey } from "../types";

const localStorageExists = (): boolean => {
  return !!window.localStorage;
};

export const readFromLocalStorage = (key: LocalStorageKey): string | null => {
  if (localStorageExists()) {
    const value = window.localStorage.getItem(key);
    return value;
  }
  return null;
};

export const writeToLocalStorage = (
  key: LocalStorageKey,
  value: any
): void => {
  if (localStorageExists()) {
    window.localStorage.setItem(key, value);
  }
};

export const deleteFromLocalStorage = (key: LocalStorageKey): void => {
  if (localStorageExists()) {
    window.localStorage.removeItem(key);
  }
};
