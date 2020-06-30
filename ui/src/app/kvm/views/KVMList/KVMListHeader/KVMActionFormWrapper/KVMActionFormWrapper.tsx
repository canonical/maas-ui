import { Col, Row } from "@canonical/react-components";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

import { pod as podSelectors } from "app/base/selectors";
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
  const selectedPodIDs = useSelector(podSelectors.selected);

  // If no KVMs are selected, close the action form.
  useEffect(() => {
    if (selectedPodIDs.length === 0) {
      setSelectedAction(null);
    }
  }, [selectedPodIDs, setSelectedAction]);

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
