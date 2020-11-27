import { Button, Tooltip } from "@canonical/react-components";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import CopyButton from "app/base/components/CopyButton";

const TableActions = ({
  copyValue,
  deleteDisabled,
  deleteTooltip,
  editDisabled,
  editPath,
  editTooltip,
  onDelete,
}) => (
  <div>
    {copyValue && <CopyButton value={copyValue} />}
    {editPath && (
      <Tooltip message={editTooltip} position="left">
        <Button
          appearance="base"
          className="is-dense u-table-cell-padding-overlap"
          disabled={editDisabled}
          element={Link}
          hasIcon
          to={editPath}
        >
          <i className="p-icon--edit">Edit</i>
        </Button>
      </Tooltip>
    )}
    {onDelete && (
      <Tooltip message={deleteTooltip} position="left">
        <Button
          appearance="base"
          className="is-dense u-table-cell-padding-overlap"
          disabled={deleteDisabled}
          hasIcon
          onClick={() => onDelete()}
          type="button"
        >
          <i className="p-icon--delete">Delete</i>
        </Button>
      </Tooltip>
    )}
  </div>
);

TableActions.propTypes = {
  copyValue: PropTypes.string,
  deleteDisabled: PropTypes.bool,
  deleteTooltip: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  editDisabled: PropTypes.bool,
  editPath: PropTypes.string,
  editTooltip: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  onDelete: PropTypes.func,
};

export default TableActions;
