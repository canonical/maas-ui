import PropTypes from "prop-types";
import React from "react";

import { Button } from "@canonical/react-components";
import { Col } from "@canonical/react-components";
import { Row } from "@canonical/react-components";

const TableDeleteConfirm = ({
  message,
  modelName,
  modelType,
  onCancel,
  onConfirm
}) => {
  return (
    <Row>
      <Col size="7">
        {message ||
          `Are you sure you want to delete ${modelType} "${modelName}"?`}{" "}
        <span className="u-text--light">
          This action is permanent and can not be undone.
        </span>
      </Col>
      <Col size="3" className="u-align--right">
        <Button onClick={onCancel}>Cancel</Button>
        <Button appearance="negative" onClick={onConfirm}>
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
  onConfirm: PropTypes.func
};

export default TableDeleteConfirm;
