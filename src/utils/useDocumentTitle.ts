import React from "react";

// Set the browser tab title for a page.
export const useDocumentTitle = (title: string): void => {
  React.useEffect(() => {
    document.title = `${title} | Admin Center`;
  }, [title]);
};
