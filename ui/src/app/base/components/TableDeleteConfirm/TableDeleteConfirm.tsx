import { ActionButton, Button, Col, Row } from "@canonical/react-components";

import { COL_SIZES } from "app/base/constants";
import { useCycled } from "app/base/hooks";

type Props = {
  deleted: boolean;
  deleting: boolean;
  message?: string;
  modelName?: string;
  modelType?: string;
  onClose: () => void;
  onConfirm: () => void;
  sidebar?: boolean;
};

const TableDeleteConfirm = ({
  deleted,
  deleting,
  message,
  modelName,
  modelType,
  onClose,
  onConfirm,
  sidebar = true,
}: Props): JSX.Element => {
  useCycled(deleted, () => {
    onClose();
  });
  const { DELETE_ROW_BUTTONS, SIDEBAR, TOTAL } = COL_SIZES;
  return (
    <Row>
      <Col
        size={
          sidebar
            ? TOTAL - SIDEBAR - DELETE_ROW_BUTTONS
            : TOTAL - DELETE_ROW_BUTTONS
        }
      >
        <p className="u-no-margin--bottom u-no-max-width">
          {message ||
            `Are you sure you want to delete ${modelType} "${modelName}"?`}{" "}
          <span className="u-text--light">
            This action is permanent and can not be undone.
          </span>
        </p>
      </Col>
      <Col size={DELETE_ROW_BUTTONS} className="u-align--right">
        <Button className="u-no-margin--bottom" onClick={onClose}>
          Cancel
        </Button>
        <ActionButton
          appearance="negative"
          className="u-no-margin--bottom"
          data-test="delete-confirm"
          loading={deleting}
          onClick={onConfirm}
          success={deleted}
        >
          Delete
        </ActionButton>
      </Col>
    </Row>
  );
};

export default TableDeleteConfirm;
