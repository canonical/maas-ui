import { Button, Col, Row } from "@canonical/react-components";
import PropTypes from "prop-types";
import React from "react";

import { COL_SIZES } from "app/base/constants";

const TableDeleteConfirm = ({
  sidebar = true,
  message,
  modelName,
  modelType,
  onCancel,
  onConfirm,
}) => {
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
        <Button className="u-no-margin--bottom" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          appearance="negative"
          className="u-no-margin--bottom"
          onClick={onConfirm}
        >
          Delete
        </Button>
      </Col>
    </Row>
  );
};

TableDeleteConfirm.propTypes = {
  message: PropTypes.string,
  modelName: PropTypes.string,
  modelType: PropTypes.string,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
};

export default TableDeleteConfirm;
