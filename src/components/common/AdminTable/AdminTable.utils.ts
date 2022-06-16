export const getFirstValue = (obj: any): string => {
  return obj[Object.keys(obj)[0]].toString();
};

export const getObjValue = (obj: any, key: string): string => {
  return obj[key].toString();
};
