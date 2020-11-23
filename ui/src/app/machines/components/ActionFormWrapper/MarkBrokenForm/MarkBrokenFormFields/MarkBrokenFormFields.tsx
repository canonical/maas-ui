import { Col, Row } from "@canonical/react-components";
import pluralize from "pluralize";
import React from "react";

import FormikField from "app/base/components/FormikField";

type Props = {
  selectedCount: number;
};

export const MarkBrokenFormFields = ({ selectedCount }: Props): JSX.Element => (
  <Row>
    <Col size="4">
      <FormikField
        label={`Add error description to ${selectedCount} ${pluralize(
          "machine",
          selectedCount
        )}`}
        type="text"
        name="comment"
      />
    </Col>
    <Col size="5">
      <p className="p-form__help">
        The error description will be visible under the status of each machine
        in the machine listing. It will be removed when the machine is marked as
        fixed.
      </p>
    </Col>
  </Row>
);

export default MarkBrokenFormFields;
