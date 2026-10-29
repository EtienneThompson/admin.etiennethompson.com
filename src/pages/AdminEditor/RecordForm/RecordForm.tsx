import React from "react";
import { Alert } from "../../../components/common/Alert";
import { Badge } from "../../../components/common/Badge";
import { Button } from "../../../components/common/Button";
import { Dialog } from "../../../components/common/Dialog";
import { CheckIcon, TrashIcon } from "../../../components/common/Icons";
import { Panel } from "../../../components/common/Panel";
import { SelectField } from "../../../components/common/SelectField";
import { Switch } from "../../../components/common/Switch";
import { TextField } from "../../../components/common/TextField";
import { EditingComponent, EditField, Header } from "../../../types";
import { hashString } from "../../../utils/hash";
import "./RecordForm.scss";

export interface RecordFormProps {
  // Every field of the record. Only some are shown, depending on the mode.
  fields: EditingComponent[];
  isNew: boolean;
  // Which fields are shown, and which can be changed, when editing.
  editableFields: EditField[];
  // Which fields are shown when creating.
  newFields: Header[];
  isSaving: boolean;
  error?: string;
  onCancel: () => void;
  onDelete: (values: EditingComponent[]) => void;
  onSave: (values: EditingComponent[]) => void;
  onCreate: (values: EditingComponent[]) => void;
}

type PendingAction = "save" | "delete";

const valueToText = (value: unknown): string =>
  value === null || value === undefined ? "" : String(value);

export const RecordForm = ({
  fields,
  isNew,
  editableFields,
  newFields,
  isSaving,
  error,
  onCancel,
  onDelete,
  onSave,
  onCreate,
}: RecordFormProps) => {
  const [values, setValues] = React.useState<EditingComponent[]>(fields);
  const [pendingAction, setPendingAction] =
    React.useState<PendingAction>("save");
  const [isConfirmingDelete, setIsConfirmingDelete] = React.useState(false);

  React.useEffect(() => setValues(fields), [fields]);

  // Close the delete dialog once the request finishes.
  React.useEffect(() => {
    if (!isSaving) {
      setIsConfirmingDelete(false);
    }
  }, [isSaving]);

  const updateValue = (index: number, value: string) => {
    setValues(
      values.map((field, i) => (i === index ? { ...field, value } : field))
    );
  };

  const isVisible = (field: EditingComponent): boolean =>
    isNew
      ? newFields.some((header) => header.text === field.label)
      : editableFields.some((header) => header.text === field.label);

  const isEditable = (field: EditingComponent): boolean =>
    isNew ||
    editableFields.some(
      (header) => header.text === field.label && header.edit
    );

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPendingAction("save");
    if (isNew) {
      // Hash a copy, so a failed request doesn't hash the password twice.
      const submitted = await Promise.all(
        values.map(async (field) =>
          field.component === "password"
            ? { ...field, value: await hashString(valueToText(field.value)) }
            : field
        )
      );
      onCreate(submitted);
    } else {
      onSave(values);
    }
  };

  const renderField = (field: EditingComponent, index: number) => {
    const id = `field-${field.id}`;
    const text = valueToText(field.value);

    if (!isEditable(field)) {
      return (
        <div className="record-form-readonly" key={id}>
          <span className="record-form-readonly-label">{field.label}</span>
          <span className="record-form-readonly-value" title={text}>
            {text === "true" ? (
              <Badge variant="success">Yes</Badge>
            ) : text === "false" ? (
              <Badge>No</Badge>
            ) : (
              text || "—"
            )}
          </span>
        </div>
      );
    }

    switch (field.component) {
      case "text":
      case "password":
        return (
          <TextField
            key={id}
            id={id}
            label={field.label}
            type={field.component}
            value={text}
            autoComplete={
              field.component === "password" ? "new-password" : "off"
            }
            hint={
              field.component === "password" && isNew
                ? "Hashed in your browser before it's sent."
                : undefined
            }
            disabled={isSaving}
            onChange={(event) => updateValue(index, event.target.value)}
          />
        );
      case "select":
        return (
          <SelectField
            key={id}
            id={id}
            label={field.label}
            value={text}
            placeholder={`Select ${field.label.toLowerCase()}…`}
            options={(field.options ?? []).map((option) => ({
              value: option.value,
              text: option.text,
            }))}
            disabled={isSaving}
            onChange={(event) => updateValue(index, event.target.value)}
          />
        );
      case "checkbox":
        return (
          <Switch
            key={id}
            id={id}
            label={field.label}
            checked={text === "true"}
            disabled={isSaving}
            onChange={(event) =>
              updateValue(index, event.target.checked.toString())
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <Panel
        title={isNew ? "Details" : "Fields"}
        description={
          isNew
            ? "Fill in the fields for the new entry."
            : "Greyed out fields can't be changed."
        }
        footer={
          <>
            {!isNew && (
              <Button
                variant="danger"
                size="sm"
                icon={<TrashIcon />}
                disabled={isSaving}
                onClick={() => setIsConfirmingDelete(true)}
              >
                Delete
              </Button>
            )}
            <div className="record-form-actions">
              <Button
                variant="secondary"
                size="sm"
                disabled={isSaving}
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                icon={<CheckIcon />}
                isLoading={isSaving && pendingAction === "save"}
                disabled={isSaving}
              >
                {isNew ? "Create" : "Save changes"}
              </Button>
            </div>
          </>
        }
      >
        <div className="record-form-body">
          {error && <Alert>{error}</Alert>}
          <div className="record-form-grid">
            {values.map((field, index) =>
              isVisible(field) ? renderField(field, index) : null
            )}
          </div>
        </div>
      </Panel>

      <Dialog
        isOpen={isConfirmingDelete}
        icon={<TrashIcon />}
        title="Delete this entry?"
        description="This permanently removes it from the database. It can't be undone."
        onClose={() => !isSaving && setIsConfirmingDelete(false)}
        actions={
          <>
            <Button
              variant="secondary"
              size="sm"
              disabled={isSaving}
              onClick={() => setIsConfirmingDelete(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              className="button--solid"
              icon={<TrashIcon />}
              isLoading={isSaving && pendingAction === "delete"}
              onClick={() => {
                setPendingAction("delete");
                onDelete(values);
              }}
            >
              Delete
            </Button>
          </>
        }
      />
    </form>
  );
};
