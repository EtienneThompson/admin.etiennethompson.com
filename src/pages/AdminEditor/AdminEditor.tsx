import React from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { Alert } from "../../components/common/Alert";
import { Button } from "../../components/common/Button";
import { DataRecord, DataTable } from "../../components/common/DataTable";
import { EmptyState } from "../../components/common/EmptyState";
import {
  ArrowLeftIcon,
  ChevronRightIcon,
  InboxIcon,
  PlusIcon,
  RefreshIcon,
  SearchIcon,
} from "../../components/common/Icons";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { PageHeader } from "../../components/common/PageHeader";
import { Panel } from "../../components/common/Panel";
import { findNavItem } from "../../navigation";
import { EditingComponent, EditField, Header } from "../../types";
import { useDocumentTitle } from "../../utils/useDocumentTitle";
import api, { errorMessage } from "../../api";
import { RecordForm } from "./RecordForm";
import "./AdminEditor.scss";

type Mode = "view" | "new" | "edit";

// Copy the field templates, so editing one record doesn't change them.
const cloneFields = (fields: EditingComponent[]): EditingComponent[] =>
  fields.map((field) => ({
    ...field,
    options: field.options?.map((option) => ({ ...option })),
  }));

// A generic editor for any table served under /admin/:elementId.
export const AdminEditor = () => {
  const { elementId = "" } = useParams();
  const navEntry = findNavItem(`/admin/${elementId}`);
  const title = navEntry?.item.label ?? elementId;

  useDocumentTitle(title);

  // Table data.
  const [rows, setRows] = React.useState<DataRecord[]>([]);
  const [defaultValues, setDefaultValues] = React.useState<EditingComponent[]>(
    []
  );
  const [headers, setHeaders] = React.useState<Header[]>([]);
  const [editableFields, setEditableFields] = React.useState<EditField[]>([]);
  const [newFields, setNewFields] = React.useState<Header[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState("");
  const [reloadCount, setReloadCount] = React.useState(0);
  const [query, setQuery] = React.useState("");

  // Editor state.
  const [mode, setMode] = React.useState<Mode>("view");
  const [editingIndex, setEditingIndex] = React.useState(-1);
  const [formFields, setFormFields] = React.useState<EditingComponent[]>([]);
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState("");

  const closeEditor = () => {
    setMode("view");
    setEditingIndex(-1);
    setFormFields([]);
    setSaveError("");
  };

  // Load the table defined by the current path.
  React.useEffect(() => {
    let isCurrent = true;
    setIsLoading(true);
    setLoadError("");
    api
      .get(`/admin/${elementId}`)
      .then((response) => {
        if (!isCurrent) return;
        setRows(response.data.elements ?? []);
        setDefaultValues(response.data.defaultValues ?? []);
        setHeaders(response.data.headers ?? []);
        setEditableFields(response.data.editableFields ?? []);
        setNewFields(response.data.newFields ?? []);
        setIsLoading(false);
      })
      .catch((error) => {
        if (!isCurrent) return;
        console.error(error);
        setLoadError(errorMessage(error, `Couldn't load ${title}.`));
        setIsLoading(false);
      });
    return () => {
      isCurrent = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elementId, reloadCount]);

  // Start fresh when switching to a different table.
  React.useEffect(() => {
    closeEditor();
    setQuery("");
  }, [elementId]);

  const onNewClicked = () => {
    setFormFields(
      cloneFields(defaultValues).map((field) => ({ ...field, value: "" }))
    );
    setMode("new");
  };

  const onRowClicked = (index: number) => {
    // Fill the field templates with the clicked row's values.
    const fields = cloneFields(defaultValues);
    headers.forEach((header) => {
      const field = fields.find((field) => field.id === header.field);
      if (field) {
        field.value = rows[index][header.field] as string | boolean;
      }
    });
    setEditingIndex(index);
    setFormFields(fields);
    setMode("edit");
  };

  // Run a create, update, or delete request, then go back to the table.
  const runRequest = (
    request: Promise<any>,
    onSuccess: (data: any) => void,
    failureMessage: string
  ) => {
    setIsSaving(true);
    setSaveError("");
    request
      .then((response) => {
        onSuccess(response.data);
        setIsSaving(false);
        closeEditor();
      })
      .catch((error) => {
        console.error(error);
        setSaveError(errorMessage(error, failureMessage));
        setIsSaving(false);
      });
  };

  const onCreate = (values: EditingComponent[]) =>
    runRequest(
      api.post(`/admin/${elementId}/create`, { newElement: values }),
      (data) => setRows([...rows, data.newElement]),
      "Couldn't create the entry."
    );

  const onSave = (values: EditingComponent[]) =>
    runRequest(
      api.put(`/admin/${elementId}/update`, { updateElement: values }),
      (data) =>
        setRows(
          rows.map((row, i) => (i === editingIndex ? data.updatedElement : row))
        ),
      "Couldn't save your changes."
    );

  const onDelete = (values: EditingComponent[]) =>
    runRequest(
      api.delete(`/admin/${elementId}/delete`, {
        data: { deleteElement: values },
      }),
      () => setRows(rows.filter((_, i) => i !== editingIndex)),
      "Couldn't delete the entry."
    );

  const eyebrow = (
    <>
      {navEntry?.section.title && <span>{navEntry.section.title}</span>}
      {navEntry?.section.title && <ChevronRightIcon />}
      {mode === "view" ? (
        <span>{title}</span>
      ) : (
        <Link
          to={`/admin/${elementId}`}
          onClick={(event) => {
            event.preventDefault();
            if (!isSaving) closeEditor();
          }}
        >
          {title}
        </Link>
      )}
      {mode !== "view" && (
        <>
          <ChevronRightIcon />
          <span>{mode === "new" ? "New" : "Edit"}</span>
        </>
      )}
    </>
  );

  if (mode !== "view") {
    return (
      <>
        <PageHeader
          eyebrow={eyebrow}
          title={mode === "new" ? "New entry" : "Edit entry"}
          description={
            mode === "new"
              ? `Add a new entry to ${title.toLowerCase()}.`
              : `Update or delete this entry in ${title.toLowerCase()}.`
          }
          actions={
            <Button
              variant="secondary"
              size="sm"
              icon={<ArrowLeftIcon />}
              disabled={isSaving}
              onClick={closeEditor}
            >
              Back to {title.toLowerCase()}
            </Button>
          }
        />
        <RecordForm
          key={`${mode}-${editingIndex}`}
          fields={formFields}
          isNew={mode === "new"}
          editableFields={editableFields}
          newFields={newFields}
          isSaving={isSaving}
          error={saveError}
          onCancel={closeEditor}
          onCreate={onCreate}
          onSave={onSave}
          onDelete={onDelete}
        />
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={navEntry?.item.description}
        actions={
          <>
            <Button
              variant="secondary"
              size="sm"
              icon={<RefreshIcon />}
              disabled={isLoading}
              onClick={() => setReloadCount(reloadCount + 1)}
            >
              Refresh
            </Button>
            <Button
              size="sm"
              icon={<PlusIcon />}
              disabled={isLoading || !!loadError}
              onClick={onNewClicked}
            >
              New entry
            </Button>
          </>
        }
      />
      <Panel
        flush
        title="Entries"
        description={
          isLoading
            ? "Loading…"
            : loadError
            ? undefined
            : `${rows.length} ${rows.length === 1 ? "entry" : "entries"}`
        }
        actions={
          <label className="admin-editor-search">
            <SearchIcon />
            <span className="sr-only">Search {title.toLowerCase()}</span>
            <input
              type="search"
              placeholder="Search…"
              value={query}
              disabled={isLoading || !!loadError || rows.length === 0}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        }
      >
        {isLoading ? (
          <div className="admin-editor-loading">
            <LoadingSpinner />
            <span>Loading {title.toLowerCase()}…</span>
          </div>
        ) : loadError ? (
          <div className="admin-editor-error">
            <Alert>{loadError}</Alert>
            <Button
              variant="secondary"
              size="sm"
              icon={<RefreshIcon />}
              onClick={() => setReloadCount(reloadCount + 1)}
            >
              Try again
            </Button>
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            icon={<InboxIcon />}
            title="Nothing here yet"
            description={`There aren't any entries in ${title.toLowerCase()}.`}
            action={
              <Button size="sm" icon={<PlusIcon />} onClick={onNewClicked}>
                New entry
              </Button>
            }
          />
        ) : (
          <DataTable
            headers={headers}
            rows={rows}
            query={query}
            onRowClick={onRowClicked}
            noResults={
              <EmptyState
                icon={<SearchIcon />}
                title="No matches"
                description={`Nothing in ${title.toLowerCase()} matches “${query.trim()}”.`}
                action={
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setQuery("")}
                  >
                    Clear search
                  </Button>
                }
              />
            }
          />
        )}
      </Panel>
    </>
  );
};
