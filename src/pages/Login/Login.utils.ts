import { ParsedQuery } from "query-string";

export const extractQueryParam = (
  queryParams: ParsedQuery<string>,
  key: string
): any => {
  let value = queryParams[key];
  if (value) {
    if (Array.isArray(value)) {
      return value[0];
    } else {
      return value;
    }
  } else {
    return value;
  }
};
