import { Button, Tooltip } from "@canonical/react-components";
import { Link } from "react-router-dom";

import CopyButton from "@/app/base/components/CopyButton";

type Props = {
  clearDisabled?: boolean;
  clearTooltip?: string | null;
  copyValue?: string;
  deleteDisabled?: boolean;
  deleteTooltip?: string | null;
  deletePath?: string;
  editDisabled?: boolean;
  editPath?: string;
  editTooltip?: string | null;
  onClear?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
};

const TableActions = ({
  clearDisabled,
  clearTooltip,
  copyValue,
  deleteDisabled,
  deletePath,
  deleteTooltip,
  editDisabled,
  editPath,
  editTooltip,
  onClear,
  onDelete,
  onEdit,
}: Props): JSX.Element => (
  <div>
    {copyValue && <CopyButton value={copyValue} />}
    {(editPath || onEdit) && (
      <Tooltip message={editTooltip} position="left">
        <Button
          appearance="base"
          className="is-dense u-table-cell-padding-overlap"
          data-testid="table-actions-edit"
          disabled={editDisabled}
          element={editPath ? Link : undefined}
          hasIcon
          onClick={() => (onEdit ? onEdit() : null)}
          to={editPath || ""}
        >
          <i className="p-icon--edit">Edit</i>
        </Button>
      </Tooltip>
    )}
    {(onDelete || deletePath) && (
      <Tooltip message={deleteTooltip} position="left">
        <Button
          appearance="base"
          className="is-dense u-table-cell-padding-overlap"
          data-testid="table-actions-delete"
          disabled={deleteDisabled}
          element={deletePath ? Link : undefined}
          hasIcon
          onClick={() => (onDelete ? onDelete() : null)}
          to={deletePath || ""}
          type={deletePath ? undefined : "button"}
        >
          <i className="p-icon--delete">Delete</i>
        </Button>
      </Tooltip>
    )}
    {onClear && (
      <Tooltip message={clearTooltip} position="left">
        <Button
          appearance="base"
          className="is-dense u-table-cell-padding-overlap"
          data-testid="table-actions-clear"
          disabled={clearDisabled}
          hasIcon
          onClick={() => onClear()}
          type="button"
        >
          <i className="p-icon--close">Clear</i>
        </Button>
      </Tooltip>
    )}
  </div>
);

export default TableActions;
