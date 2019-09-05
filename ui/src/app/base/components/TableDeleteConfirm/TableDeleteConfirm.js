import PropTypes from "prop-types";
import React from "react";

import Button from "app/base/components/Button";
import Col from "app/base/components/Col";
import Row from "app/base/components/Row";

const TableDeleteConfirm = ({ modelName, modelType, onCancel, onConfirm }) => {
  return (
    <Row>
      <Col size="7">
        Are you sure you want to delete {modelType} "{modelName}"?{" "}
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
  modelName: PropTypes.string,
  modelType: PropTypes.string,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func
};

export default TableDeleteConfirm;
