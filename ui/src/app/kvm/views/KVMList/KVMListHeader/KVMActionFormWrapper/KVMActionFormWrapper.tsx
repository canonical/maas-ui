import { Col, Row } from "@canonical/react-components";
import React from "react";

import DeleteForm from "./DeleteForm";
import RefreshForm from "./RefreshForm";

type Props = {
  selectedAction: string;
  setSelectedAction: (action: string) => void;
};

const KVMActionFormWrapper = ({
  selectedAction,
  setSelectedAction,
}: Props): JSX.Element => {
  if (!selectedAction) {
    return null;
  }

  return (
    <Row data-test="kvm-action-form-wrapper">
      <Col size="12">
        <hr />
        {selectedAction === "delete" && (
          <DeleteForm setSelectedAction={setSelectedAction} />
        )}
        {selectedAction === "refresh" && (
          <RefreshForm setSelectedAction={setSelectedAction} />
        )}
      </Col>
    </Row>
  );
};

export default KVMActionFormWrapper;
